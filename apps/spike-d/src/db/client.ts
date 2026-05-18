// Spike D — postgres client factory

import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { getDatabaseUrl, type DbTarget } from "../env.js";

export type DbConn = {
  readonly sql: ReturnType<typeof postgres>;
  readonly db: PostgresJsDatabase;
  close(): Promise<void>;
};

export function createConn(target: DbTarget): DbConn {
  const url = getDatabaseUrl(target);
  const sql = postgres(url, { max: 4, prepare: false });
  const db = drizzle(sql);
  return {
    sql,
    db,
    async close() {
      await sql.end({ timeout: 5 });
    },
  };
}
