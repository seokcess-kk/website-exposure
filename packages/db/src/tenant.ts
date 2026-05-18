// @glitzy/db/tenant — withTenantTransaction + ScopedDb brand
// Spike A LOCAL_PASS 코드 승격 — NULLIF cascade·SET LOCAL ROLE·set_config·tx scope·ScopedDb runtime brand

import type postgres from "postgres";
import type { InstanceId } from "@glitzy/shared-types";

import { ScopedDbBrandError } from "./errors.js";

// PKG1-004 cycle3: module-local Symbol — globally non-discoverable·forge 불가
const SCOPED_BRAND = Symbol("@glitzy/db/scoped");

/**
 * ScopedDb: transaction object branded as tenant-scoped.
 * postgres-js의 TransactionSql에 runtime symbol property로 brand·외부에서 SET LOCAL 우회 차단.
 */
export type ScopedTx = postgres.TransactionSql & { [SCOPED_BRAND]: true };

export function assertScopedTx(tx: unknown): asserts tx is ScopedTx {
  if (typeof tx !== "function" || (tx as any)[SCOPED_BRAND] !== true) {
    throw new ScopedDbBrandError("tx is not scoped — call withTenantTransaction first");
  }
}

export type TenantTxOptions = {
  readonly instanceId: InstanceId;
  /** 추가 GUC (예: app.actor_id). 기본은 instance_id만. */
  readonly extraConfigs?: ReadonlyArray<{ name: string; value: string }>;
};

/**
 * withTenantTransaction:
 *   1. sql.begin
 *   2. SET LOCAL ROLE app_tenant_user (caller가 super-user면 NOBYPASSRLS 적용)
 *   3. SELECT set_config('app.current_instance_id', <instanceId>, true)
 *   4. extraConfigs 적용
 *   5. ScopedTx brand 설정
 *   6. fn(tx) 호출·tx 종료 후 brand 자동 해제
 */
export async function withTenantTransaction<T>(
  sql: postgres.Sql,
  opts: TenantTxOptions,
  fn: (tx: ScopedTx) => Promise<T>,
): Promise<T> {
  return sql.begin(async (tx) => {
    await tx`SET LOCAL ROLE app_tenant_user`;
    await tx`SELECT set_config('app.current_instance_id', ${opts.instanceId}, true)`;
    for (const cfg of opts.extraConfigs ?? []) {
      await tx`SELECT set_config(${cfg.name}, ${cfg.value}, true)`;
    }
    Object.defineProperty(tx, SCOPED_BRAND, { value: true, configurable: false, enumerable: false, writable: false });
    return fn(tx as ScopedTx);
  }) as Promise<T>;
}
