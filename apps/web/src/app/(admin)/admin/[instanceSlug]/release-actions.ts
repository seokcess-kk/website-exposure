// @glitzy/web/(admin)/[instanceSlug]/release-actions — ADMIN_UX_REDESIGN v1.0 § 4.2 + § 10
// 출시 server action — release_state 안 'draft' → 'release-pending' 전이 + audit.
// W10 task 안 published 전이 (검수 완료 후) 별도 server action 분리 예정.

"use server";

import { revalidatePath } from "next/cache";
import { TenantResolveError } from "@glitzy/auth";

import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { evaluateInstanceRelease } from "@/lib/admin/release-evaluator";
import { loadReleaseReadiness } from "@/lib/admin/release-readiness";
import { revalidatePublicSite } from "@/lib/revalidate-site";

export type ReleaseActionResult =
  | { ok: true; nextState: "release-pending" }
  | { ok: false; reason: string };

/**
 * requestReleaseReview — instance.release_state 안 'draft' → 'release-pending' 전이.
 *   - releasable === false → reject (차단 항목 있음)
 *   - lifecycle === 'published' → reject (이미 발행됨)
 *   - lifecycle === 'release-pending' → idempotent (no-op + ok)
 *   - audit_event 안 'release-requested' INSERT.
 */
export async function requestReleaseReview(instanceSlug: string): Promise<ReleaseActionResult> {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) return { ok: false, reason: `auth: ${err.reason}` };
    throw err;
  }

  try {
    const result = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        // (1) 현 readiness 재산정 — 호출자 stale state 회피
        const readiness = await loadReleaseReadiness(tx, ctx.instanceId, instanceSlug);

        if (readiness.lifecycle === "published") {
          return { ok: false as const, reason: "이미 발행된 instance" };
        }
        if (readiness.lifecycle === "release-pending") {
          // idempotent — 이미 검수 중. no-op.
          return { ok: true as const, nextState: "release-pending" as const };
        }
        // 재 evaluate (releasable 검증)
        const evalResult = evaluateInstanceRelease(readiness.evalInput);
        if (!evalResult.releasable) {
          return { ok: false as const, reason: `차단 ${evalResult.blockers.length}건 잔존` };
        }

        // (2) release_state 전이
        const now = new Date().toISOString();
        await tx`
          UPDATE instance
             SET release_state = jsonb_set(
               jsonb_set(
                 jsonb_set(release_state, '{state}', to_jsonb('release-pending'::text)),
                 '{lastTransitionAt}', to_jsonb(${now}::text)
               ),
               '{transitionBy}', to_jsonb(${ctx.userId}::text)
             )
           WHERE id = ${ctx.instanceId}::uuid
        `;

        // (3) audit
        await tx`
          INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
          VALUES (
            'instance.release-requested',
            ${ctx.userId}::uuid,
            ${ctx.instanceId}::uuid,
            ${tx.json({ prevState: readiness.lifecycle, nextState: "release-pending", at: now })}
          )
        `;

        return { ok: true as const, nextState: "release-pending" as const };
      },
    );

    if (result.ok) {
      revalidatePath(`/admin/${instanceSlug}`);
    }
    return result;
  } catch (err) {
    if (err instanceof TenantResolveError) return { ok: false, reason: `auth: ${err.reason}` };
    throw err;
  }
}

export type PublishActionResult =
  | { ok: true; nextState: "published" }
  | { ok: false; reason: string };

/**
 * publishInstance — release-pending → published 전이.
 *   - super-admin 만 허용 (운영자가 자체 발행하면 검수 의미 상실).
 *   - lifecycle === 'published' → no-op (idempotent).
 *   - audit_event 안 'instance.published' INSERT.
 */
export async function publishInstance(instanceSlug: string): Promise<PublishActionResult> {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) return { ok: false, reason: `auth: ${err.reason}` };
    throw err;
  }

  try {
    const result = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        if (!ctx.isSuperAdmin) {
          return { ok: false as const, reason: "발행은 super-admin 권한 필요" };
        }
        const readiness = await loadReleaseReadiness(tx, ctx.instanceId, instanceSlug);
        if (readiness.lifecycle === "published") {
          return { ok: true as const, nextState: "published" as const };
        }
        if (readiness.lifecycle !== "release-pending") {
          return { ok: false as const, reason: `현재 ${readiness.lifecycle} 상태 — release-pending 만 발행 가능` };
        }

        const now = new Date().toISOString();
        await tx`
          UPDATE instance
             SET release_state = jsonb_set(
               jsonb_set(
                 jsonb_set(
                   jsonb_set(release_state, '{state}', to_jsonb('published'::text)),
                   '{lastTransitionAt}', to_jsonb(${now}::text)
                 ),
                 '{transitionBy}', to_jsonb(${ctx.userId}::text)
               ),
               '{releasedAt}', to_jsonb(${now}::text)
             )
           WHERE id = ${ctx.instanceId}::uuid
        `;

        await tx`
          INSERT INTO audit_event (event_type, actor_user_id, to_instance_id, payload)
          VALUES (
            'instance.published',
            ${ctx.userId}::uuid,
            ${ctx.instanceId}::uuid,
            ${tx.json({ prevState: readiness.lifecycle, nextState: "published", at: now })}
          )
        `;

        return { ok: true as const, nextState: "published" as const };
      },
    );

    if (result.ok) {
      revalidatePath(`/admin/${instanceSlug}`);
      // 발행(site 최초 공개) — 공개 사이트 전체 ISR 캐시 무효화.
      revalidatePublicSite();
    }
    return result;
  } catch (err) {
    if (err instanceof TenantResolveError) return { ok: false, reason: `auth: ${err.reason}` };
    throw err;
  }
}
