// @glitzy/web/(admin)/[instanceSlug]/conditions/new
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { TenantResolveError, assertActionEligibility } from "@glitzy/auth";

import { MedicalConditionForm, type TreatmentOption } from "@/components/forms/MedicalConditionForm";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { saveCondition } from "../actions";

export default async function ConditionNewPage({ params }: { params: { instanceSlug: string } }) {
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

  let treatmentOptions: TreatmentOption[] = [];
  try {
    treatmentOptions = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<{ id: string; title: string }[]>`
          SELECT id, title FROM treatment_page
           WHERE instance_id = ${ctx.instanceId}::uuid AND status = 'published'
           ORDER BY title ASC
        `;
        return rows.map((r) => ({ value: r.id, label: r.title }));
      },
    );
  } catch (err) {
    if (err instanceof TenantResolveError) {
      const a = mapAuthDenyReasonToUi(err.reason);
      if (a.kind === "redirect-sign-in") redirect(`/sign-in/cleanup?reason=${a.reason}`);
      if (a.kind === "not-found") notFound();
    }
    throw err;
  }

  const bound = saveCondition.bind(null, params.instanceSlug, null);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">증상 안내 추가</h1>
        <Link href={`/admin/${params.instanceSlug}/conditions`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <MedicalConditionForm action={bound} initial={null} isNew instanceSlug={params.instanceSlug} treatmentOptions={treatmentOptions} />
    </main>
  );
}
