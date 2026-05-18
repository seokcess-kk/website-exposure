// Spike E — postgres + drizzle client factory

import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { env } from "../env.js";

export type DbConn = {
  readonly sql: ReturnType<typeof postgres>;
  readonly db: PostgresJsDatabase;
  close(): Promise<void>;
};

export function createConn(): DbConn {
  const sql = postgres(env.DATABASE_URL, { max: 4, prepare: false });
  const db = drizzle(sql);
  return {
    sql,
    db,
    async close() { await sql.end({ timeout: 5 }); },
  };
}
