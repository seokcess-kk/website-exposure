// @glitzy/web/lib/tenant — withSkeletonTx 2단계 패턴 (Plan v1.0 § 5.3 ADMIN-UI-04·30)
// packages/auth.withResolvedTenantTransaction 의 RLS role 누락 우회

import {
  getActiveSession,
  resolveTenantContext,
  switchSuperAdminInstance,
  type TenantContext,
} from "@glitzy/auth";
import { withTenantTransaction, type ScopedTx } from "@glitzy/db";
import { asUuidV4, type InstanceId } from "@glitzy/shared-types";
import { cache } from "react";

import { getSqlBase } from "./db";
import { getAuthCfg } from "./env";

// super-admin 은 모든 인스턴스에 접근 권한이 있으나 resolveTenantContext 는 세션의
// superAdminSelectedInstanceId 가 요청 인스턴스와 일치할 때만 통과시킨다(단일 current-instance 모델).
// 매직링크 시절엔 구 demo-admin-enter 가 진입 시 이 값을 세팅했다 — 비밀번호 로그인은 /admin 허브로만
// 보내므로, 인스턴스 접근 시점에 요청 인스턴스로 자동 switch 해 준다. operator 는 무영향.
async function ensureSuperAdminInstanceSelected(
  sql: ReturnType<typeof getSqlBase>,
  cfg: ReturnType<typeof getAuthCfg>,
  signedToken: string,
  instanceId: string,
): Promise<void> {
  let session;
  try {
    session = await getActiveSession(sql, cfg, signedToken);
  } catch {
    return; // 세션 무효 — resolveTenantContext 가 정식으로 거부 처리
  }
  if (session.superAdminSelectedInstanceId?.toLowerCase() === instanceId.toLowerCase()) return;
  const rows = await sql<{ is_super_admin: boolean }[]>`
    SELECT is_super_admin FROM admin_user WHERE id = ${session.userId} LIMIT 1
  `;
  if (rows.length === 0 || rows[0]!.is_super_admin !== true) return; // operator/미존재 — 무영향
  await switchSuperAdminInstance(sql, cfg, signedToken, session.userId, instanceId);
}

export const resolveTenantContextForRequest = cache(async (
  signedToken: string,
  instanceId: InstanceId,
): Promise<TenantContext> => {
  const sql = getSqlBase();
  const cfg = getAuthCfg();
  await ensureSuperAdminInstanceSelected(sql, cfg, signedToken, instanceId);
  return resolveTenantContext(sql, cfg, signedToken, instanceId);
});

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
  const ctx = await resolveTenantContextForRequest(args.signedToken, args.instanceId);
  // ctx.instanceId 는 plain string · branded InstanceId 변환 (ADMIN-UI-30)
  const brandedId = asUuidV4(ctx.instanceId) as InstanceId;
  return withTenantTransaction(sql, { instanceId: brandedId }, (tx) => fn(tx, ctx));
}
