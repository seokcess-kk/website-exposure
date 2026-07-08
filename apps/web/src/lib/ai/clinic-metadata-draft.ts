// @glitzy/web/lib/ai/clinic-metadata-draft — 의원정보 고급 문안 (clinic metadata) AI 자동 채움
//
// 입력: instance 의 기존 사실 데이터 (기관명·소개·소재지·published Pillar/Spoke·active 키워드)
// 출력: metadata JSON 초안 (keyStats 제외 — 검증 수치는 운영자 직접 입력 · naverPlace 미포함).
// suggest-keyword-matches 패턴 답습 — withSkeletonTx + callClaude + zod + sanitize.

"use server";

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { isNextControlFlowError, resolveActionContext } from "@/lib/action-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";

import { callClaude } from "./anthropic-client";
import {
  buildClinicMetadataDraftSystemPrompt,
  buildClinicMetadataDraftUserPrompt,
  clinicMetadataDraftOutputSchema,
  safeParseLlmJson,
} from "./prompt-templates";
import {
  sanitizeClinicMetadataDraft,
  type DbPillarRow,
} from "./clinic-metadata-draft-helpers";
import type { SuggestionResult } from "./suggestion-result";

export type ClinicMetadataDraftResult = { metadataJson: string };

export async function generateClinicMetadataDraftAction(
  instanceSlug: string,
): Promise<SuggestionResult<ClinicMetadataDraftResult>> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { ok: false, reason: "config-missing", message: "AI 서비스 미설정 — 관리자에게 문의하세요." };
  }
  let aCtx;
  try {
    aCtx = await resolveActionContext(instanceSlug);
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    return { ok: false, reason: "context-error", message: "권한 확인 실패 — 다시 로그인 후 시도하세요." };
  }

  try {
    return await withSkeletonTx(
      { signedToken: aCtx.signedToken, instanceId: aCtx.instanceId },
      async (tx, ctx): Promise<SuggestionResult<ClinicMetadataDraftResult>> => {
        const [clinicRow] = await tx<Array<{ id: string; name: string; description: string }>>`
          SELECT id, name, description FROM clinic_profile
           WHERE instance_id = ${ctx.instanceId}::uuid
           ORDER BY created_at ASC
           LIMIT 1
        `;
        if (!clinicRow) {
          return {
            ok: false,
            reason: "context-error",
            message: "의원 기본 정보 (기관명·소개) 를 먼저 저장한 뒤 자동 채움을 사용하세요.",
          };
        }

        const [locationRows, pillarRows, spokeRows, keywordRows] = await Promise.all([
          tx<Array<{ address_region: string; address_locality: string }>>`
            SELECT address_region, address_locality FROM location_profile
             WHERE instance_id = ${ctx.instanceId}::uuid
             ORDER BY (slug = 'main') DESC, created_at ASC
             LIMIT 1
          `,
          tx<Array<{ slug: string; title: string; summary: string }>>`
            SELECT slug, title, summary FROM treatment_page
             WHERE instance_id = ${ctx.instanceId}::uuid
               AND status = 'published' AND pillar_slug IS NULL
             ORDER BY created_at ASC
             LIMIT 6
          `,
          tx<Array<{ pillar_slug: string; title: string }>>`
            SELECT pillar_slug, title FROM treatment_page
             WHERE instance_id = ${ctx.instanceId}::uuid
               AND status = 'published' AND pillar_slug IS NOT NULL
             ORDER BY created_at ASC
          `,
          tx<Array<{ label: string }>>`
            SELECT label FROM keyword_target
             WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'active'
             ORDER BY priority ASC, created_at ASC
             LIMIT 20
          `,
        ]);

        const spokesByPillar = new Map<string, string[]>();
        for (const s of spokeRows) {
          const list = spokesByPillar.get(s.pillar_slug) ?? [];
          list.push(s.title);
          spokesByPillar.set(s.pillar_slug, list);
        }
        const dbPillars: DbPillarRow[] = pillarRows.map((p) => ({
          slug: p.slug,
          title: p.title,
          summary: p.summary,
          spokeTitles: spokesByPillar.get(p.slug) ?? [],
        }));

        const systemPrompt = buildClinicMetadataDraftSystemPrompt();
        const userPrompt = buildClinicMetadataDraftUserPrompt({
          clinicName: clinicRow.name,
          clinicDescription: clinicRow.description,
          addressRegion: locationRows[0]?.address_region ?? null,
          addressLocality: locationRows[0]?.address_locality ?? null,
          pillars: dbPillars,
          keywordLabels: keywordRows.map((k) => k.label),
        });

        const result = await callClaude({
          tx,
          instanceId: ctx.instanceId,
          triggeredBy: ctx.userId,
          promptTemplate: "clinic-metadata-draft",
          systemPrompt,
          userPrompt,
          entityType: "ClinicProfile",
          entityId: clinicRow.id,
          maxTokens: 2048,
        });

        if (!result.ok) {
          return { ok: false, reason: result.reason, message: result.message, logId: result.logId };
        }

        const parsed = safeParseLlmJson(result.text, clinicMetadataDraftOutputSchema);
        if (!parsed.ok) {
          return { ok: false, reason: "parse-error", message: parsed.reason, logId: result.logId };
        }

        const clean = sanitizeClinicMetadataDraft(parsed.data, dbPillars);
        return {
          ok: true,
          logId: result.logId,
          data: { metadataJson: JSON.stringify(clean, null, 2) },
        };
      },
    );
  } catch (err) {
    if (isNextControlFlowError(err)) throw err;
    if (err instanceof TenantResolveError) {
      const action = mapAuthDenyReasonToUi(err.reason);
      if (action.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${action.reason}`);
      if (action.kind === "not-found") notFound();
      return {
        ok: false,
        reason: "context-error",
        message: action.kind === "forbidden" || action.kind === "info" ? action.message : "권한 확인 실패",
      };
    }
    console.error("[generateClinicMetadataDraftAction] unexpected", err);
    return { ok: false, reason: "api-error", message: "AI 호출 중 오류가 발생했습니다." };
  }
}
