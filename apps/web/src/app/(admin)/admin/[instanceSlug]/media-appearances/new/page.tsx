import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { requirePageContext } from "@/lib/page-context";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { withSkeletonTx } from "@/lib/tenant";
import { MediaAppearanceForm } from "@/components/forms/MediaAppearanceForm";
import { saveMediaAppearance } from "../actions";

export default async function MediaAppearanceNewPage({ params }: { params: { instanceSlug: string } }) {
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

  let doctorOptions: ReadonlyArray<{ value: string; label: string }> = [];
  try {
    doctorOptions = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<{ id: string; name: string }[]>`
          SELECT id, name FROM doctor_profile
           WHERE instance_id = ${ctx.instanceId}::uuid AND active = true
           ORDER BY display_order ASC, name ASC
        `;
        return rows.map((r) => ({ value: r.id, label: r.name }));
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

  const bound = saveMediaAppearance.bind(null, params.instanceSlug, null);
  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">미디어 출연 추가</h1>
        <Link href={`/admin/${params.instanceSlug}/media-appearances`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <MediaAppearanceForm action={bound} initial={null} isNew doctorOptions={doctorOptions} />
    </main>
  );
}
