// @glitzy/db — public API

export * from "./errors.js";
export {
  withTenantTransaction,
  assertScopedTx,
  type ScopedTx,
  type TenantTxOptions,
} from "./tenant.js";
export {
  withServiceRole,
  assertServiceRoleAllowed,
  assertServiceRoleTx,
  type ServiceRoleContext,
  type ServiceRoleTx,
} from "./service-role.js";
export {
  withAdvisoryLock,
  tryAcquire as tryAcquireAdvisoryLock,
  release as releaseAdvisoryLock,
} from "./advisory-lock.js";
