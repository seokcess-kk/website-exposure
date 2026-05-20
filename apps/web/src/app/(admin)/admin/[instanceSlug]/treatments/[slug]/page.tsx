// @glitzy/web/(admin)/[instanceSlug]/treatments/[slug] — 편집
// cycle2-3entity WEB-23: requirePageContext 통일
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { loadSiteInitial } from "@/lib/site-initial";
import { TreatmentPageForm, type TreatmentPageInitial, type PillarOption } from "@/components/forms/TreatmentPageForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
import { PublicSiteLink } from "@/components/admin/PublicSiteLink";
import { deleteTreatmentPage, saveTreatmentPage } from "../actions";

export default async function TreatmentEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }

  // cycle5-3entity WEB-51: withSkeletonTx 의 TenantResolveError catch
  let initial: TreatmentPageInitial | null;
  try {
    initial = await withSkeletonTx(
    { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
    async (tx, ctx): Promise<TreatmentPageInitial | null> => {
      assertActionEligibility(ctx, "operator-edit-content");
      const rows = await tx<{
        slug: string;
        title: string;
        summary: string;
        body_markdown: string;
        status: string;
        risk_level: string | null;
        hero_image_url: string | null;
        pillar_slug: string | null;
        metadata: unknown;
      }[]>`
        SELECT slug, title, summary, body_markdown,
               status::text AS status,
               risk_level::text AS risk_level,
               hero_image_url,
               pillar_slug,
               metadata
          FROM treatment_page
         WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
         LIMIT 1
      `;
      const r = rows[0];
      if (!r) return null;
      const meta = (typeof r.metadata === "object" && r.metadata !== null)
        ? r.metadata as Record<string, unknown>
        : {};
      const principles = Array.isArray(meta.principles) ? meta.principles : null;
      return {
        slug: r.slug,
        title: r.title,
        summary: r.summary,
        bodyMarkdown: r.body_markdown,
        status: r.status,
        riskLevel: r.risk_level ?? "",
        heroImageUrl: r.hero_image_url ?? "",
        pillarSlug: r.pillar_slug ?? "",
        principlesJson: principles ? JSON.stringify(principles, null, 2) : "",
      };
    },
  );
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      if (a.kind === "forbidden" || a.kind === "info") {
        return <main className="p-6"><p>{a.message}</p></main>;
      }
    }
    throw err;
  }
  if (initial === null) notFound();

  // Phase 3: clinic.metadata.treatmentPillars 기반 pillar select 옵션 fetch
  const siteInitial = await loadSiteInitial(params.instanceSlug);
  const pillarOptions: ReadonlyArray<PillarOption> = (siteInitial?.clinic.metadata.treatmentPillars ?? [])
    .map((p) => ({ value: p.slug, label: p.title }));

  const boundSave = saveTreatmentPage.bind(null, params.instanceSlug, params.slug);
  const boundDelete = deleteTreatmentPage.bind(null, params.instanceSlug, params.slug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">시술/진료 페이지 편집 · {initial.title}</h1>
        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>

      <WorkflowActionButtons
        instanceSlug={params.instanceSlug}
        contentType="TreatmentPage"
        contentRef={params.slug}
        currentStatus={initial.status}
      />

      <PublicSiteLink
        instanceSlug={params.instanceSlug}
        visible={initial.status === "published"}
        publicPath={`/treatments/${params.slug}`}
        hiddenReason={`현재 status='${initial.status}' — published 상태가 아닙니다`}
      />

      <TreatmentPageForm action={boundSave} initial={initial} isNew={false} pillarOptions={pillarOptions} />

      <DeleteForm action={boundDelete} confirmMessage="정말 이 시술/진료 페이지를 삭제하시겠습니까?" />
    </main>
  );
}
