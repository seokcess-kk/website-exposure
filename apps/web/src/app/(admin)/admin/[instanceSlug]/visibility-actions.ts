// @glitzy/web/(admin)/[instanceSlug]/visibility-actions — readiness 재계산 server actions
// SEO_VISIBILITY_OPS_PLAN v0.2 § 5

"use server";

import { revalidatePath } from "next/cache";
import { TenantResolveError } from "@glitzy/auth";

import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { computeAllReadinessForInstance, type ReadinessResult } from "@/lib/seo-readiness";

export type RecomputeAllResult =
  | { ok: true; total: number; byEntityType: Record<string, number> }
  | { ok: false; reason: string };

export async function recomputeAllReadinessAction(instanceSlug: string): Promise<RecomputeAllResult> {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) return { ok: false, reason: `auth: ${err.reason}` };
    throw err;
  }

  try {
    const summary = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx) => computeAllReadinessForInstance(tx, pageCtx.instanceId),
    );
    revalidatePath(`/admin/${instanceSlug}`);
    return { ok: true, total: summary.total, byEntityType: summary.byEntityType };
  } catch (err) {
    if (err instanceof TenantResolveError) return { ok: false, reason: `auth: ${err.reason}` };
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: `재계산 실패: ${message}` };
  }
}

export type { ReadinessResult };
