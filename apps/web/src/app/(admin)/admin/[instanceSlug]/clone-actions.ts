// @glitzy/web/(admin)/[instanceSlug]/clone-actions — 사이트 복제 server action
// 사용자가 현재 보고 있는 instance 를 source 로 새 instance 를 만든다.
// 디자인·시술 카탈로그·약관 템플릿은 그대로 복사 / 병원·의료진 정보는 비움.
//
// ADMIN_PERMISSION_SEPARATION v1 § 3 — super-admin only.
// action level + lib level 이중 가드.

"use server";

import { revalidatePath } from "next/cache";
import { TenantResolveError } from "@glitzy/auth";

import { requirePageContext } from "@/lib/page-context";
import {
  cloneInstance,
  CloneInstanceValidationError,
  type CloneInstanceResult,
} from "@/lib/admin/clone-instance";

export type CloneInstanceActionResult =
  | { ok: true; result: CloneInstanceResult }
  | { ok: false; reason: string };

export async function cloneInstanceAction(
  sourceInstanceSlug: string,
  targetSlug: string,
  targetDisplayName: string,
): Promise<CloneInstanceActionResult> {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(sourceInstanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) return { ok: false, reason: `auth: ${err.reason}` };
    throw err;
  }

  // action level 가드 — lib 진입 전 즉시 차단
  if (!pageCtx.ctx.isSuperAdmin) {
    return { ok: false, reason: "사이트 복제는 운영자(super-admin) 만 가능합니다." };
  }

  try {
    const result = await cloneInstance({
      sourceInstanceId: pageCtx.instanceId,
      targetSlug,
      targetDisplayName,
      actorUserId: pageCtx.userId,
      actorIsSuperAdmin: pageCtx.ctx.isSuperAdmin,
    });
    revalidatePath(`/admin/${targetSlug}`);
    return { ok: true, result };
  } catch (err) {
    if (err instanceof CloneInstanceValidationError) {
      return { ok: false, reason: err.message };
    }
    if (err instanceof TenantResolveError) {
      return { ok: false, reason: `auth: ${err.reason}` };
    }
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: `복제 실패: ${message}` };
  }
}
