// docker-compose up 후 postgres + pgbouncer가 ready될 때까지 대기
import postgres from "postgres";

const TIMEOUT_MS = 60_000;
const POLL_MS = 1000;

async function ping(url) {
  const sql = postgres(url, { max: 1, prepare: false, idle_timeout: 5 });
  try {
    await sql`SELECT 1`;
    await sql.end({ timeout: 1 });
    return true;
  } catch {
    try { await sql.end({ timeout: 1 }); } catch {}
    return false;
  }
}

async function waitFor(name, url) {
  const start = Date.now();
  while (Date.now() - start < TIMEOUT_MS) {
    if (await ping(url)) {
      console.log(`  ${name} ready`);
      return;
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
  throw new Error(`${name} not ready after ${TIMEOUT_MS}ms`);
}

const superUrl = process.env.DATABASE_URL_SUPER;
const tenantUrl = process.env.DATABASE_URL_TENANT;
if (!superUrl) { console.error("DATABASE_URL_SUPER missing"); process.exit(1); }

await waitFor("postgres", superUrl);
// tenant role은 migration 후에야 사용 가능 — wait-db는 super만 검증
console.log("wait-db: done");
