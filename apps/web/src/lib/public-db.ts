// @glitzy/web/lib/public-db — postgres.Sql singleton for app_public_reader
// SoT: PUBLIC_SITE_RENDER_PLAN v1.0 § 3.1 PSR-DATA-01 + § 6 작업 #3
//
// 공개 사이트 SSR 전용 connection. WEB_DATABASE_URL (어드민) 와 분리된 pool.
// app_public_reader role 은 SELECT only · RLS USING instance_id 정합.

import postgres from "postgres";
import { getEnv } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var __glitzy_sql_public: postgres.Sql | undefined;
}

let moduleSingleton: postgres.Sql | null = null;

export function getSqlPublic(): postgres.Sql {
  if (moduleSingleton !== null) return moduleSingleton;
  if (globalThis.__glitzy_sql_public) {
    moduleSingleton = globalThis.__glitzy_sql_public;
    return moduleSingleton;
  }
  const env = getEnv();
  const sql = postgres(env.WEB_PUBLIC_DATABASE_URL, {
    max: 10,
    idle_timeout: 30,
    onnotice: () => {},
  });
  moduleSingleton = sql;
  globalThis.__glitzy_sql_public = sql;
  return sql;
}
