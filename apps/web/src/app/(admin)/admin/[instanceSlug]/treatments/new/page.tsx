// @glitzy/web/(admin)/[instanceSlug]/treatments/new
// cycle1-3entity WEB-02: page entry 에서 session/slug/tenant/eligibility 모두 검증
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";
import { TreatmentPageForm, type PillarOption } from "@/components/forms/TreatmentPageForm";
import { requirePageContext } from "@/lib/page-context";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { loadSiteInitial } from "@/lib/site-initial";
import { withSkeletonTx } from "@/lib/tenant";
import { loadEvidenceLinkOptions, type EvidenceLinkOptions } from "@/lib/admin/evidence-link-options";
import { saveTreatmentPage } from "../actions";

export default async function TreatmentNewPage({ params }: { params: { instanceSlug: string } }) {
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

  const bound = saveTreatmentPage.bind(null, params.instanceSlug, null);

  // Phase 3: clinic.metadata.treatmentPillars 기반 pillar select 옵션
  const siteInitial = await loadSiteInitial(params.instanceSlug);
  const pillarOptions: ReadonlyArray<PillarOption> = (siteInitial?.clinic.metadata.treatmentPillars ?? [])
    .map((p) => ({ value: p.slug, label: p.title }));

  let evidenceOptions: EvidenceLinkOptions = {
    publications: [], mediaAppearances: [], faqs: [], treatmentPages: [], articles: [], medicalConditionPages: [],
  };
  try {
    evidenceOptions = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => loadEvidenceLinkOptions(tx, ctx.instanceId),
    );
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
    }
    // fallthrough — 빈 옵션으로 폼은 그래도 그림
  }

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">시술/진료 페이지 추가</h1>
        <Link href={`/admin/${params.instanceSlug}/treatments`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <TreatmentPageForm
        action={bound}
        initial={null}
        isNew
        pillarOptions={pillarOptions}
        instanceSlug={params.instanceSlug}
        evidenceOptions={evidenceOptions}
        existingEvidenceLinks={[]}
      />
    </main>
  );
}
