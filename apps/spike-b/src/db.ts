// Spike B — DB connection (Spike A 패턴 동일)

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";

function requireEnv(key: string): string {
  const v = process.env[key];
  if (!v) throw new Error(`Missing env: ${key}`);
  return v;
}

const DEBUG = process.env.SPIKE_DB_DEBUG === "1";
const commonOptions = {
  prepare: false,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {},
  ...(DEBUG ? { debug: (_c: number, q: string) => console.log("[DB]", q.slice(0, 200)) } : {}),
} as const;

// super-user (control-plane access·migration·outbox claim)
export const sqlSuper = postgres(requireEnv("DATABASE_URL_SUPER"), { max: 8, ...commonOptions });
export const dbSuper = drizzle(sqlSuper);

// tenant (inbox·RLS 적용)
export const sqlTenant = postgres(requireEnv("DATABASE_URL_TENANT"), { max: 30, ...commonOptions });
export const dbTenant = drizzle(sqlTenant);

export async function closeAll(): Promise<void> {
  await Promise.allSettled([sqlSuper.end(), sqlTenant.end()]);
}
