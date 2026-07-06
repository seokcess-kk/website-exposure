// @glitzy/web/(admin)/[instanceSlug]/articles/categories/actions — NAVER_EXPOSURE Tier 2
// article_category.pillar 편집 (격리 액션) — 렌더타임 클러스터 교차링크(site-cluster-links.ts) 브리지를
// 운영자가 SQL 없이 켤 수 있게 한다.
//   저장 값 = clinic.metadata.treatmentPillars[].slug (= treatment_page.pillar_slug) — 이 값이어야
//   아티클↔시술 양방향(관련 진료 / 관련 칼럼) 모두 매칭. 빈 값 = NULL(브리지 해제).
// 골격: saveNaverVerification (clinic-profile/actions) 의 격리 단일 컬럼 UPDATE 패턴.

"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  AuthDeniedError,
  assertActionEligibility,
  getActiveSession,
  TenantResolveError,
} from "@glitzy/auth";
import { asUuidV4, type AdminUserId } from "@glitzy/shared-types";

import { getSqlBase } from "@/lib/db";
import { getAuthCfg } from "@/lib/env";
import { readSessionCookie } from "@/lib/session-cookie";
import { slugResolver } from "@/lib/slug-resolver";
import { withSkeletonTx } from "@/lib/tenant";
import { revalidatePublicSite } from "@/lib/revalidate-site";
import { mapDbErrorToResult } from "@/lib/errors";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { isNextControlFlowError } from "@/lib/action-context";
import type { SaveResult } from "@/lib/save-result";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Mapping = { categoryId: string; pillar: string };

// clinic_profile.metadata(JSONB) → 유효 pillar slug 집합. db-projection.parseClinicMetadata 는 미export 라
// 여기서 최소 가드 파싱 (ClinicMetadataEditor.parseInitial 과 동일 형태).
function extractPillarSlugs(metadata: unknown): Set<string> {
  const slugs = new Set<string>();
  const tp =
    metadata && typeof metadata === "object"
      ? (metadata as Record<string, unknown>).treatmentPillars
      : undefined;
  if (Array.isArray(tp)) {
    for (const p of tp) {
      if (p && typeof p === "object" && typeof (p as Record<string, unknown>).slug === "string") {
        const slug = ((p as Record<string, unknown>).slug as string).trim();
        if (slug) slugs.add(slug);
      }
    }
  }
  return slugs;
}

// hidden "mappings" JSON → Mapping[]. 형식 오류면 null.
function parseMappings(raw: unknown): Mapping[] | null {
  if (typeof raw !== "string" || raw.trim() === "") return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed)) return null;
  const out: Mapping[] = [];
  for (const m of parsed) {
    if (!m || typeof m !== "object") return null;
    const o = m as Record<string, unknown>;
    if (typeof o.categoryId !== "string" || typeof o.pillar !== "string") return null;
    out.push({ categoryId: o.categoryId, pillar: o.pillar.trim() });
  }
  return out;
}

export async function saveCategoryPillars(
  instanceSlug: string,
  _prev: SaveResult | null,
  formData: FormData,
): Promise<SaveResult> {
  const mappings = parseMappings(formData.get("mappings"));
  if (mappings === null) {
    return { ok: false, fieldErrors: {}, formError: "잘못된 입력 형식입니다." };
  }
  // categoryId 형식 사전 검증 (uuid cast 실패 방지).
  for (const m of mappings) {
    if (!UUID_RE.test(m.categoryId)) {
      return { ok: false, fieldErrors: {}, formError: "잘못된 카테고리 식별자입니다." };
    }
  }

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

  let userId: AdminUserId;
  try {
    userId = asUuidV4(session.userId) as AdminUserId;
  } catch {
    redirect("/sign-in/cleanup?reason=session-not-found");
  }
  const instanceId = await slugResolver(sqlBase, instanceSlug, userId);
  if (instanceId === null) notFound();

  try {
    // 검증 실패한 pillar slug 를 반환(있으면), 없으면 null. 유효하지 않으면 어떤 UPDATE 도 수행 안 함(원자적).
    const invalidSlug = await withSkeletonTx({ signedToken, instanceId }, async (tx, ctx) => {
      assertActionEligibility(ctx, "operator-edit-content");
      const metaRows = await tx<{ metadata: unknown }[]>`
        SELECT metadata FROM clinic_profile
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = 'clinic' LIMIT 1
      `;
      const validSlugs = extractPillarSlugs(metaRows[0]?.metadata);
      const bad = mappings.find((m) => m.pillar !== "" && !validSlugs.has(m.pillar));
      if (bad) return bad.pillar;

      for (const m of mappings) {
        await tx`
          UPDATE article_category
             SET pillar = ${m.pillar === "" ? null : m.pillar}, updated_at = now()
           WHERE instance_id = ${ctx.instanceId}::uuid AND id = ${m.categoryId}::uuid
        `;
      }
      return null;
    });

    if (invalidSlug !== null) {
      return {
        ok: false,
        fieldErrors: {},
        formError: `알 수 없는 pillar slug: "${invalidSlug}". 의원 정보의 진료 영역(treatmentPillars) slug 만 선택할 수 있습니다.`,
      };
    }

    revalidatePath(`/admin/${instanceSlug}/articles/categories`);
    // pillar 는 공개 사이트 렌더타임 교차링크(관련 진료·관련 칼럼)에 영향 → 즉시 무효화.
    revalidatePublicSite();
    return { ok: true };
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    const mapped = mapDbErrorToResult(err);
    if (mapped !== null) {
      if (mapped.kind === "field") return { ok: false, fieldErrors: mapped.errors };
      return { ok: false, fieldErrors: {}, formError: mapped.message };
    }
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      if (action.kind === "forbidden") return { ok: false, fieldErrors: {}, formError: action.message };
      if (action.kind === "info") return { ok: false, fieldErrors: {}, formError: action.message };
    }
    console.error("[saveCategoryPillars] unexpected error", err);
    return { ok: false, fieldErrors: {}, formError: "저장 중 오류가 발생했습니다." };
  }
}
