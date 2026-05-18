// Spike B — withTenantTransaction (Spike A 패턴 동일·ScopedDb brand)

import { sql } from "drizzle-orm";
import type { PostgresJsTransaction } from "drizzle-orm/postgres-js";
import { dbTenant } from "./db.ts";
import { TenantContextError } from "./errors.ts";

const SCOPED_BRAND: unique symbol = Symbol("scopedDb");
export type ScopedDb = PostgresJsTransaction<Record<string, never>, Record<string, never>> & {
  readonly [SCOPED_BRAND]: true;
};

function asScopedDb(tx: PostgresJsTransaction<Record<string, never>, Record<string, never>>): ScopedDb {
  Object.defineProperty(tx, SCOPED_BRAND, { value: true, enumerable: false, configurable: false });
  return tx as ScopedDb;
}

export async function withTenantTransaction<T>(
  instanceId: string,
  fn: (tx: ScopedDb) => Promise<T>,
): Promise<T> {
  if (!isValidUuid(instanceId)) {
    throw new TenantContextError(`invalid instanceId: ${instanceId}`);
  }
  return dbTenant.transaction(async (tx) => {
    await tx.execute(sql`SET LOCAL ROLE app_tenant_user`);
    await tx.execute(sql`SELECT set_config('app.current_instance_id', ${instanceId}, true)`);
    return fn(asScopedDb(tx));
  });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isValidUuid(s: string): boolean {
  return UUID_RE.test(s);
}
