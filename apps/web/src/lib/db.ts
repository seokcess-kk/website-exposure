// @glitzy/web/lib/db — postgres.Sql singleton (Plan v1.0 § 3 lib/db.ts)
// Next.js dev HMR 안전 — globalThis 캐싱

import postgres from "postgres";
import { getEnv } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __glitzy_sql_base: postgres.Sql | undefined;
}

// cycle4-code WEB-52: prod/dev 모두 singleton — globalThis 는 dev HMR 안전성용
let moduleSingleton: postgres.Sql | null = null;

export function getSqlBase(): postgres.Sql {
  if (moduleSingleton !== null) return moduleSingleton;
  if (globalThis.__glitzy_sql_base) {
    moduleSingleton = globalThis.__glitzy_sql_base;
    return moduleSingleton;
  }
  const env = getEnv();
  const sql = postgres(env.WEB_DATABASE_URL, {
    // Plan § 7: WEB_DATABASE_URL 최소 권한 + GRANT app_tenant_user TO <web_role> (NOINHERIT)
    // tenant tx 진입 시 SET LOCAL ROLE app_tenant_user (packages/db.withTenantTransaction)
    max: 10,
    idle_timeout: 30,
    onnotice: () => {},
  });
  moduleSingleton = sql;
  globalThis.__glitzy_sql_base = sql;
  return sql;
}
