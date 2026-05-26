// @glitzy/web/(admin)/[instanceSlug]/conditions/[slug] — 증상 안내 편집
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { MedicalConditionForm, type MedicalConditionInitial, type TreatmentOption } from "@/components/forms/MedicalConditionForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import { PublicSiteLink } from "@/components/admin/PublicSiteLink";
import { loadEvidenceLinkOptions, type EvidenceLinkOptions } from "@/lib/admin/evidence-link-options";
import { loadContentEntityLinks, type EvidenceLink } from "@/lib/admin/content-entity-link";
import { saveCondition, deleteCondition } from "../actions";

export default async function ConditionEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "forbidden" || a.kind === "info") return <main className="p-6"><p>{a.message}</p></main>;
    }
    throw err;
  }

  let initial: MedicalConditionInitial | null;
  let treatmentOptions: TreatmentOption[] = [];
  let evidenceOptions: EvidenceLinkOptions = { publications: [], mediaAppearances: [], faqs: [], treatmentPages: [], articles: [], medicalConditionPages: [] };
  let existingEvidenceLinks: ReadonlyArray<EvidenceLink> = [];
  let isPublished = false;
  try {
    const result = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx): Promise<{
        initial: MedicalConditionInitial | null;
        treatmentOptions: TreatmentOption[];
        evidenceOptions: EvidenceLinkOptions;
        existingEvidenceLinks: ReadonlyArray<EvidenceLink>;
        isPublished: boolean;
      }> => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<{
          id: string;
          slug: string;
          title: string;
          summary: string;
          body_markdown: string;
          status: string;
          risk_level: string | null;
          hero_image_url: string | null;
          primary_treatment_id: string | null;
        }[]>`
          SELECT id::text AS id, slug, title, summary, body_markdown, status::text AS status, risk_level::text AS risk_level,
                 hero_image_url, primary_treatment_id
            FROM medical_condition_page
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
           LIMIT 1
        `;
        const r = rows[0];
        if (!r) return { initial: null, treatmentOptions: [], evidenceOptions, existingEvidenceLinks: [], isPublished: false };
        const [treatments, eOpts, eLinks] = await Promise.all([
          tx<{ id: string; title: string }[]>`
            SELECT id, title FROM treatment_page
             WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published'
             ORDER BY title ASC
          `,
          loadEvidenceLinkOptions(tx, ctx.instanceId),
          loadContentEntityLinks(tx, ctx.instanceId, "MedicalConditionPage", r.id),
        ]);
        return {
          initial: {
            slug: r.slug,
            title: r.title,
            summary: r.summary,
            bodyMarkdown: r.body_markdown,
            riskLevel: r.risk_level ?? "",
            heroImageUrl: r.hero_image_url ?? "",
            primaryTreatmentId: r.primary_treatment_id ?? "",
          },
          treatmentOptions: treatments.map((t) => ({ value: t.id, label: t.title })),
          evidenceOptions: eOpts,
          existingEvidenceLinks: eLinks,
          isPublished: r.status === "published",
        };
      },
    );
    initial = result.initial;
    treatmentOptions = result.treatmentOptions;
    evidenceOptions = result.evidenceOptions;
    existingEvidenceLinks = result.existingEvidenceLinks;
    isPublished = result.isPublished;
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
      if (a.kind === "forbidden" || a.kind === "info") return <main className="p-6"><p>{a.message}</p></main>;
    }
    throw err;
  }
  if (initial === null) notFound();

  const boundSave = saveCondition.bind(null, params.instanceSlug, params.slug);
  const boundDelete = deleteCondition.bind(null, params.instanceSlug, params.slug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">증상 안내 편집 · {initial.title}</h1>
        <Link href={`/admin/${params.instanceSlug}/conditions`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>

      <PublicSiteLink instanceSlug={params.instanceSlug} visible={isPublished} publicPath={`/conditions/${initial.slug}`} hiddenReason="발행 상태가 아닙니다" />

      <MedicalConditionForm action={boundSave} initial={initial} isNew={false} instanceSlug={params.instanceSlug} treatmentOptions={treatmentOptions} evidenceOptions={evidenceOptions} existingEvidenceLinks={existingEvidenceLinks} />

      <DeleteForm action={boundDelete} confirmMessage="정말 이 증상 페이지를 삭제하시겠습니까?" />
    </main>
  );
}
