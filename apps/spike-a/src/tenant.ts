// Spike A — withTenantTransaction
// 인프라 결정 v1.0 § 1.1 SoT
//
// 정정 (SPIKEA1-005): SET LOCAL ROLE app_tenant_user — DSN 오배선 방어
// 정정 (SPIKEA1-006): scopedDb wrapper로 transaction 밖 사용 차단
// 정정 (SPIKEA1-011): malformed UUID 검증
// 정정 (SPIKEA1-012): runtime guard

import { sql } from "drizzle-orm";
import type { PostgresJsTransaction } from "drizzle-orm/postgres-js";
import { dbTenant } from "./db.ts";

// brand-typed wrapper — tx 밖 사용 차단 (SPIKEA1-012)
const SCOPED_BRAND: unique symbol = Symbol("scopedDb");
export type ScopedDb = PostgresJsTransaction<Record<string, never>, Record<string, never>> & {
  readonly [SCOPED_BRAND]: true;
};

function asScopedDb(tx: PostgresJsTransaction<Record<string, never>, Record<string, never>>): ScopedDb {
  // SPIKEA2-001 정정: runtime brand를 실제 객체에 부여
  Object.defineProperty(tx, SCOPED_BRAND, { value: true, enumerable: false, configurable: false });
  return tx as ScopedDb;
}

/**
 * tenant 작업은 반드시 이 헬퍼 안에서만.
 * fn 안의 tx는 ScopedDb (brand type). transaction 밖 사용은 컴파일러+runtime 차단.
 *
 * - SET LOCAL ROLE app_tenant_user: DSN 오배선 방어 (SPIKEA1-005)
 * - SELECT set_config(...): RLS context 전달
 * - rollback 시 SET LOCAL 자동 해제 (pgbouncer transaction pooling 안전)
 */
export async function withTenantTransaction<T>(
  instanceId: string,
  fn: (tx: ScopedDb) => Promise<T>,
): Promise<T> {
  if (!isValidUuid(instanceId)) {
    throw new TenantContextError(`invalid instanceId: ${instanceId}`);
  }
  return dbTenant.transaction(async (tx) => {
    // SPIKEA1-005: connection level role을 명시 강제 (DSN 오배선 시 transaction 안에서만 적용)
    await tx.execute(sql`SET LOCAL ROLE app_tenant_user`);
    await tx.execute(sql`SELECT set_config('app.current_instance_id', ${instanceId}, true)`);
    return fn(asScopedDb(tx));
  });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isValidUuid(s: string): boolean {
  return UUID_RE.test(s);
}

export class TenantContextError extends Error {
  override readonly name = "TenantContextError";
}

/**
 * tenant table 접근 시 runtime guard.
 * 실제 운영 helper에서 사용 — transaction 밖 query는 throw.
 */
export function assertScopedDb(maybeScoped: unknown): asserts maybeScoped is ScopedDb {
  if (!maybeScoped || typeof maybeScoped !== "object" || !(SCOPED_BRAND in maybeScoped)) {
    throw new TenantContextError("tenant table access outside withTenantTransaction");
  }
}
