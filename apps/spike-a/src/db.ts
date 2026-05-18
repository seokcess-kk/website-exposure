// Spike A — DB connection layer (SPIKEA1-016 정정: idle/connect timeout·debug 추가)

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

const DEBUG = process.env.SPIKE_DB_DEBUG === "1";

const commonOptions = {
  prepare: false, // pgbouncer transaction pooling 호환
  idle_timeout: 20, // 초
  connect_timeout: 10,
  onnotice: () => {},
  ...(DEBUG ? { debug: (_c: number, q: string) => console.log("[DB]", q.slice(0, 200)) } : {}),
} as const;

// super (5433 — direct)
export const sqlSuper = postgres(requireEnv("DATABASE_URL_SUPER"), { max: 4, ...commonOptions });
export const dbSuper = drizzle(sqlSuper);

// tenant via pgbouncer (6433 — transaction pooling)
export const sqlTenant = postgres(requireEnv("DATABASE_URL_TENANT"), { max: 30, ...commonOptions });
export const dbTenant = drizzle(sqlTenant);

// service-role (postgres direct, RLS bypass)
export const sqlServiceRole = postgres(requireEnv("DATABASE_URL_SERVICE_ROLE"), { max: 4, ...commonOptions });
export const dbServiceRole = drizzle(sqlServiceRole);

export async function closeAll(): Promise<void> {
  await Promise.allSettled([sqlSuper.end(), sqlTenant.end(), sqlServiceRole.end()]);
}
