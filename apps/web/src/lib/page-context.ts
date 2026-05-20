// @glitzy/web/lib/page-context — admin Page-level 공통 ctx resolve (eligibility 검증 포함)
// cycle1-3entity WEB-02·03·07: 목록/신규/상세 페이지에서 slug resolve + tenant resolve + eligibility 모두 통과해야 렌더링

import { notFound, redirect } from "next/navigation";
import {
  assertActionEligibility,
  TenantResolveError,
  type ActionType,
  type TenantContext,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId, type InstanceId } from "@glitzy/shared-types";

import { getSqlBase } from "./db";
import { readSessionCookie } from "./session-cookie";
import { slugResolver } from "./slug-resolver";
import { mapAuthDenyReasonToUi } from "./deny-reason-map";
import { resolveTenantContextForRequest } from "./tenant";

export type PageContext = {
  signedToken: string;
  userId: AdminUserId;
  instanceId: InstanceId;
  ctx: TenantContext;
};

/**
 * Admin page entry — 세션 → slug → tenant resolve → eligibility 통과 시 PageContext 반환.
 * 결과 분기:
 *   - 세션/slug deny: redirect/notFound (Next.js control-flow throw)
 *   - tenant resolve / eligibility deny: TenantResolveError throw (caller 가 catch 후 forbidden/info 렌더링)
 * cycle2-3entity WEB-31: 책임 경계 명확화.
 */
export async function requirePageContext(
  instanceSlug: string,
  action: ActionType = "operator-edit-content",
): Promise<PageContext> {
  const signedToken = readSessionCookie();
  if (!signedToken) redirect("/sign-in");

  const sqlBase = getSqlBase();
  const instanceId = await slugResolver(sqlBase, instanceSlug);
  if (instanceId === null) notFound();

  let ctx: TenantContext;
  try {
    ctx = await resolveTenantContextForRequest(signedToken, instanceId);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      // forbidden/info — page 측에서 별도 화면 보여줘야 함 → 예외 throw
      throw err;
    }
    throw err;
  }

  try {
    assertActionEligibility(ctx, action);
  } catch (err) {
    // operator-role-required / *-ineligible → forbidden 처리
    throw err;
  }

  const userId = asUuidV4(ctx.userId) as AdminUserId;

  return { signedToken, userId, instanceId, ctx };
}
