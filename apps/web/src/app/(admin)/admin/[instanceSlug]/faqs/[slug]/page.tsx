import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { FaqForm, type FaqInitial } from "@/components/forms/FaqForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
import { PublicSiteLink } from "@/components/admin/PublicSiteLink";
import { deleteFaq, saveFaq } from "../actions";

export default async function FaqEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
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
    initial: FaqInitial;
    categoryOptions: ReadonlyArray<{ value: string; label: string }>;
    doctorOptions: ReadonlyArray<{ value: string; label: string }>;
    treatmentOptions: ReadonlyArray<{ value: string; label: string }>;
  } | null;
  try {
    bundle = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        // 병렬화 (사용자 검수 2026-05-20) — faq → categories/doctors/treatments 4 RTT → 2 RTT
        const rows = await tx<{
          slug: string;
          question: string;
          answer: string;
          display_order: number;
          category_id: string | null;
          author_doctor_id: string | null;
          related_treatment_id: string | null;
          status: string;
        }[]>`
          SELECT slug, question, answer, display_order, category_id, author_doctor_id, related_treatment_id,
                 status::text AS status
            FROM faq
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
           LIMIT 1
        `;
        const r = rows[0];
        if (!r) return null;
        const [categoryRows, doctorRows, treatmentRows] = await Promise.all([
          tx<{ id: string; name: string }[]>`
            SELECT id, name FROM article_category
             WHERE instance_id = ${ctx.instanceId}::uuid
             ORDER BY display_order ASC, name ASC
          `,
          tx<{ id: string; name: string; active: boolean }[]>`
            SELECT id, name, active FROM doctor_profile
             WHERE instance_id = ${ctx.instanceId}::uuid
               AND (active = true OR id = ${r.author_doctor_id ?? null}::uuid)
             ORDER BY active DESC, display_order ASC, name ASC
          `,
          tx<{ id: string; title: string }[]>`
            SELECT id, title FROM treatment_page
             WHERE instance_id = ${ctx.instanceId}::uuid
             ORDER BY title ASC
          `,
        ]);
        return {
          initial: {
            slug: r.slug,
            question: r.question,
            answer: r.answer,
            displayOrder: String(r.display_order),
            categoryId: r.category_id ?? "",
            authorDoctorId: r.author_doctor_id ?? "",
            relatedTreatmentId: r.related_treatment_id ?? "",
            status: r.status,
          },
          categoryOptions: categoryRows.map((c) => ({ value: c.id, label: c.name })),
          doctorOptions: doctorRows.map((d) => ({
            value: d.id,
            label: d.active ? d.name : `${d.name} (비활성)`,
          })),
          treatmentOptions: treatmentRows.map((t) => ({ value: t.id, label: t.title })),
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
  if (bundle === null) notFound();

  const boundSave = saveFaq.bind(null, params.instanceSlug, params.slug);
  const boundDelete = deleteFaq.bind(null, params.instanceSlug, params.slug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FAQ 편집 · {bundle.initial.question.slice(0, 40)}{bundle.initial.question.length > 40 ? "…" : ""}</h1>
        <Link href={`/admin/${params.instanceSlug}/faqs`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <WorkflowActionButtons
        instanceSlug={params.instanceSlug}
        contentType="FAQ"
        contentRef={params.slug}
        currentStatus={bundle.initial.status}
      />
      <PublicSiteLink
        instanceSlug={params.instanceSlug}
        visible={bundle.initial.status === "published"}
        publicPath={`/faq#faq-${params.slug}`}
        hiddenReason={`현재 status='${bundle.initial.status}' — published 상태가 아닙니다`}
      />
      <FaqForm
        action={boundSave}
        initial={bundle.initial}
        isNew={false}
        categoryOptions={bundle.categoryOptions}
        doctorOptions={bundle.doctorOptions}
        treatmentOptions={bundle.treatmentOptions}
      />
      <DeleteForm action={boundDelete} confirmMessage="정말 이 FAQ 를 삭제하시겠습니까?" />
    </main>
  );
}
