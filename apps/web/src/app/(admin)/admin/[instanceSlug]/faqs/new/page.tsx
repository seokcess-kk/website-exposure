import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { requirePageContext } from "@/lib/page-context";
import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { withSkeletonTx } from "@/lib/tenant";
import { FaqForm } from "@/components/forms/FaqForm";
import { saveFaq } from "../actions";

export default async function FaqNewPage({ params }: { params: { instanceSlug: string } }) {
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

  let bundle: {
    categoryOptions: ReadonlyArray<{ value: string; label: string }>;
    doctorOptions: ReadonlyArray<{ value: string; label: string }>;
    treatmentOptions: ReadonlyArray<{ value: string; label: string }>;
  };
  try {
    bundle = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        // 병렬화 (사용자 검수 2026-05-20) — 3 query 동시
        const [categoryRows, doctorRows, treatmentRows] = await Promise.all([
          tx<{ id: string; name: string }[]>`
            SELECT id, name FROM article_category
             WHERE instance_id = ${ctx.instanceId}::uuid
             ORDER BY display_order ASC, name ASC
          `,
          tx<{ id: string; name: string }[]>`
            SELECT id, name FROM doctor_profile
             WHERE instance_id = ${ctx.instanceId}::uuid AND active = true
             ORDER BY display_order ASC, name ASC
          `,
          tx<{ id: string; title: string }[]>`
            SELECT id, title FROM treatment_page
             WHERE instance_id = ${ctx.instanceId}::uuid
             ORDER BY title ASC
          `,
        ]);
        return {
          categoryOptions: categoryRows.map((r) => ({ value: r.id, label: r.name })),
          doctorOptions: doctorRows.map((r) => ({ value: r.id, label: r.name })),
          treatmentOptions: treatmentRows.map((r) => ({ value: r.id, label: r.title })),
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

  const bound = saveFaq.bind(null, params.instanceSlug, null);
  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FAQ 추가</h1>
        <Link href={`/admin/${params.instanceSlug}/faqs`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <FaqForm
        action={bound}
        initial={null}
        isNew
        categoryOptions={bundle.categoryOptions}
        doctorOptions={bundle.doctorOptions}
        treatmentOptions={bundle.treatmentOptions}
      />
    </main>
  );
}
