// @glitzy/web/lib/action-context — Server Action 공통 ctx resolve helper
// ClinicProfile/Doctor/Treatment/Article actions 가 같은 패턴 사용

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import {
  AuthDeniedError,
  assertActionEligibility,
  getActiveSession,
  type ActionType,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId, type InstanceId } from "@glitzy/shared-types";

import { getSqlBase } from "./db";
import { getAuthCfg } from "./env";
import { readSessionCookie } from "./session-cookie";
import { slugResolver } from "./slug-resolver";

export type ActionContext = {
  signedToken: string;
  userId: AdminUserId;
  instanceId: InstanceId;
};

/**
 * Server Action 진입 공통 (auth + slug resolve).
 * 실패 시 redirect/notFound throw — caller 는 try 후 정상 흐름만 처리.
 * action 인자가 주어지면 추가로 assertActionEligibility 까지 검증 (resolveTenantContext 는 withSkeletonTx 안에서 별도 수행).
 */
export async function resolveActionContext(instanceSlug: string): Promise<ActionContext> {
  const signedToken = readSessionCookie();
  if (!signedToken) redirect("/sign-in");

  const sqlBase = getSqlBase();
  const cfg = getAuthCfg();

  let session;
  try {
    session = await getActiveSession(sqlBase, cfg, signedToken);
  } catch (err) {
    const reason = err instanceof AuthDeniedError ? err.reason : "session-not-found";
    redirect(`/sign-in/cleanup?reason=${reason}`);
  }

  // cycle2-3entity WEB-26: branded UUID narrow
  let userId: AdminUserId;
  try {
    userId = asUuidV4(session.userId) as AdminUserId;
  } catch {
    redirect("/sign-in/cleanup?reason=session-not-found");
  }
  const instanceId = await slugResolver(sqlBase, instanceSlug, userId);
  if (instanceId === null) notFound();

  return { signedToken, userId, instanceId };
}

/**
 * Next.js App Router 의 redirect()/notFound() 가 throw 하는 control-flow error 판별.
 * try/catch 가 일반 error 로 swallow 하지 않도록 outer catch 에서 rethrow 용도.
 * cycle1-3entity WEB-01.
 */
export function isNextControlFlowError(err: unknown): boolean {
  if (typeof err !== "object" || err === null) return false;
  const digest = (err as { digest?: unknown }).digest;
  if (typeof digest !== "string") return false;
  // cycle5-3entity WEB-48: Next 14+ notFound() 는 NEXT_HTTP_ERROR_FALLBACK;404 패턴 사용
  return (
    digest.startsWith("NEXT_REDIRECT") ||
    digest === "NEXT_NOT_FOUND" ||
    digest.startsWith("NEXT_HTTP_ERROR_FALLBACK")
  );
}

/** action eligibility check helper — withSkeletonTx 안에서 ctx 받은 후 호출 */
export { assertActionEligibility, type ActionType };
