// @glitzy/web/lib/admin/upload-actions — 어드민 이미지 업로드 server actions
// 사용자 결정 2026-05-20: Supabase Storage signed upload URL 발급 + eligibility 검증.

"use server";

import { redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { assertActionEligibility, resolveActionContext } from "@/lib/action-context";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { withSkeletonTx } from "@/lib/tenant";
import { signImageUploadUrl, type SignUploadResult } from "./supabase-storage";

/**
 * 어드민 이미지 업로드용 signed PUT URL 발급.
 *
 * 흐름:
 *   1. 세션·인스턴스·eligibility 검증
 *   2. Supabase Storage signed upload URL 생성
 *   3. client 가 받은 URL 에 직접 PUT → public URL 을 form 안 hidden input 에 저장
 *
 * @param instanceSlug — instance 격리 path segment 안 사용
 * @param kind — entity 별 upload 분류 (e.g., "treatment-hero", "article-hero", "publication-thumb", "media-thumb")
 * @param contentType — 클라이언트가 보낸 파일 MIME (jpg/png/webp/gif 만 허용)
 * @param size — 파일 byte size (5MB 제한)
 */
export async function requestImageUploadUrl(
  instanceSlug: string,
  kind: string,
  contentType: string,
  size: number,
): Promise<SignUploadResult> {
  try {
    const aCtx = await resolveActionContext(instanceSlug);

    return await withSkeletonTx({ signedToken: aCtx.signedToken, instanceId: aCtx.instanceId }, async (_tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      return signImageUploadUrl({ instanceSlug, kind, contentType, size });
    });
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "forbidden" || action.kind === "info") {
        return { ok: false, message: action.message };
      }
    }
    throw err;
  }
}
