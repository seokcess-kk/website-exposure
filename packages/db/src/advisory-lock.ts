// @glitzy/db/advisory-lock — pg_try_advisory_lock helpers
// Spike A·D LOCAL_PASS 패턴

import type postgres from "postgres";

import { AdvisoryLockNotAcquiredError } from "./errors.js";

export async function tryAcquire(sql: postgres.Sql, lockKey: bigint | string): Promise<boolean> {
  const keyStr = typeof lockKey === "bigint" ? lockKey.toString() : lockKey;
  const r = await sql<{ ok: boolean }[]>`SELECT pg_try_advisory_lock(${keyStr}::bigint) AS ok`;
  return r[0]?.ok === true;
}

export async function release(sql: postgres.Sql, lockKey: bigint | string): Promise<boolean> {
  const keyStr = typeof lockKey === "bigint" ? lockKey.toString() : lockKey;
  const r = await sql<{ ok: boolean }[]>`SELECT pg_advisory_unlock(${keyStr}::bigint) AS ok`;
  return r[0]?.ok === true;
}

/**
 * withAdvisoryLock: try-acquire → fn → finally release.
 * lock 획득 실패 시 AdvisoryLockNotAcquiredError throw.
 * release 실패는 silent log (best-effort).
 */
export async function withAdvisoryLock<T>(
  sql: postgres.Sql,
  lockKey: bigint | string,
  fn: () => Promise<T>,
): Promise<T> {
  const got = await tryAcquire(sql, lockKey);
  if (!got) throw new AdvisoryLockNotAcquiredError(String(lockKey));
  try {
    return await fn();
  } finally {
    try { await release(sql, lockKey); } catch { /* best-effort */ }
  }
}
