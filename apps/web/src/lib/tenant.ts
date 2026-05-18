// @glitzy/web/lib/tenant — withSkeletonTx 2단계 패턴 (Plan v1.0 § 5.3 ADMIN-UI-04·30)
// packages/auth.withResolvedTenantTransaction 의 RLS role 누락 우회

import { resolveTenantContext, type TenantContext } from "@glitzy/auth";
import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
import { asUuidV4, type InstanceId } from "@glitzy/shared-types";

import { getSqlBase } from "./db";
import { getAuthCfg } from "./env";

/**
 * Plan § 5.3: 2단계 패턴
 *   1) resolveTenantContext (signature 검증 · TTL · membership · eligibility · audit)
 *   2) withTenantTransaction (SET LOCAL ROLE app_tenant_user + SET LOCAL app.current_instance_id)
 */
export async function withSkeletonTx<T>(
  args: { signedToken: string; instanceId: InstanceId },
  fn: (tx: ScopedTx, ctx: TenantContext) => Promise<T>,
): Promise<T> {
  const sql = getSqlBase();
  const cfg = getAuthCfg();
  const ctx = await resolveTenantContext(sql, cfg, args.signedToken, args.instanceId);
  // ctx.instanceId 는 plain string · branded InstanceId 변환 (ADMIN-UI-30)
  const brandedId = asUuidV4(ctx.instanceId) as InstanceId;
  return withTenantTransaction(sql, { instanceId: brandedId }, (tx) => fn(tx, ctx));
}
