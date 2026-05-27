import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { MediaAppearanceForm, type MediaAppearanceInitial } from "@/components/forms/MediaAppearanceForm";
import { DeleteForm } from "@/components/forms/DeleteForm";
import { BreadcrumbTitleSetter } from "@/components/admin/BreadcrumbContext";
import { deleteMediaAppearance, saveMediaAppearance } from "../actions";

export default async function MediaAppearanceEditPage({ params }: { params: { instanceSlug: string; slug: string } }) {
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
    initial: MediaAppearanceInitial;
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
          channel_name: string;
          channel_type: string;
          published_date: string;
          duration_seconds: number | null;
          url: string;
          thumbnail_url: string | null;
          summary: string;
          author_doctor_id: string | null;
          status: string;
        }[]>`
          SELECT slug, title, channel_name,
                 channel_type::text AS channel_type,
                 to_char(published_date, 'YYYY-MM-DD') AS published_date,
                 duration_seconds, url, thumbnail_url, summary, author_doctor_id,
                 status::text AS status
            FROM media_appearance
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
        return {
          initial: {
            slug: r.slug,
            title: r.title,
            channelName: r.channel_name,
            channelType: r.channel_type,
            publishedDate: r.published_date,
            durationSeconds: r.duration_seconds !== null ? String(r.duration_seconds) : "",
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

  const boundSave = saveMediaAppearance.bind(null, params.instanceSlug, params.slug);
  const boundDelete = deleteMediaAppearance.bind(null, params.instanceSlug, params.slug);

  return (
    <main className="flex flex-col gap-6">
      <BreadcrumbTitleSetter title={bundle.initial.title} />
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">미디어 편집 · {bundle.initial.title}</h1>
        <Link href={`/admin/${params.instanceSlug}/media-appearances`} className="text-sm text-slate-600 hover:underline">← 목록</Link>
      </header>
      <MediaAppearanceForm
        action={boundSave}
        initial={bundle.initial}
        isNew={false}
        doctorOptions={bundle.doctorOptions}
        instanceSlug={params.instanceSlug}
      />
      <DeleteForm action={boundDelete} confirmMessage="정말 이 미디어를 삭제하시겠습니까?" />
    </main>
  );
}
