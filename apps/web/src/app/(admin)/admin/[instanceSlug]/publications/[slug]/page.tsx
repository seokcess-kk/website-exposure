import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { PublicationForm, type PublicationInitial } from "@/components/forms/PublicationForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import { WorkflowActionButtons } from "@/components/forms/WorkflowActionButtons";
import { deletePublication, savePublication } from "../actions";

export default async function PublicationEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
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
    initial: PublicationInitial;
    doctorOptions: ReadonlyArray<{ value: string; label: string }>;
  } | null;
  try {
    bundle = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<{
          slug: string;
          title: string;
          authors: unknown;
          journal: string | null;
          published_date: string;
          doi: string | null;
          pubmed_id: string | null;
          url: string;
          thumbnail_url: string | null;
          summary: string;
          author_doctor_id: string | null;
          status: string;
        }[]>`
          SELECT slug, title, authors, journal,
                 to_char(published_date, 'YYYY-MM-DD') AS published_date,
                 doi, pubmed_id, url, thumbnail_url, summary, author_doctor_id,
                 status::text AS status
            FROM publication
           WHERE instance_id = ${ctx.instanceId}::uuid AND slug = ${params.slug}
           LIMIT 1
        `;
        const r = rows[0];
        if (!r) return null;
        const doctorRows = await tx<{ id: string; name: string; active: boolean }[]>`
          SELECT id, name, active FROM doctor_profile
           WHERE instance_id = ${ctx.instanceId}::uuid
             AND (active = true OR id = ${r.author_doctor_id ?? null}::uuid)
           ORDER BY active DESC, display_order ASC, name ASC
        `;
        const authorsArr = Array.isArray(r.authors) ? r.authors.filter((x): x is string => typeof x === "string") : [];
        return {
          initial: {
            slug: r.slug,
            title: r.title,
            authors: authorsArr.join(", "),
            journal: r.journal ?? "",
            publishedDate: r.published_date,
            doi: r.doi ?? "",
            pubmedId: r.pubmed_id ?? "",
            url: r.url,
            thumbnailUrl: r.thumbnail_url ?? "",
            summary: r.summary,
            authorDoctorId: r.author_doctor_id ?? "",
            status: r.status,
          },
          doctorOptions: doctorRows.map((d) => ({
            value: d.id,
            label: d.active ? d.name : `${d.name} (비활성)`,
          })),
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

  const boundSave = savePublication.bind(null, params.instanceSlug, params.slug);
  const boundDelete = deletePublication.bind(null, params.instanceSlug, params.slug);

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">학술 인용 편집 · {bundle.initial.title}</h1>
        <Link href={`/admin/${params.instanceSlug}/publications`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <WorkflowActionButtons
        instanceSlug={params.instanceSlug}
        contentType="Publication"
        contentRef={params.slug}
        currentStatus={bundle.initial.status}
      />
      <PublicationForm action={boundSave} initial={bundle.initial} isNew={false} doctorOptions={bundle.doctorOptions} />
      <DeleteForm action={boundDelete} confirmMessage="정말 이 학술 인용을 삭제하시겠습니까?" />
    </main>
  );
}
