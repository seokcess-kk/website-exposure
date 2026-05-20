import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";

type Row = {
  slug: string;
  title: string;
  channel_name: string;
  channel_type: string;
  published_date: string;
  status: string;
  author_name: string | null;
};

export default async function MediaAppearancesListPage({ params }: { params: { instanceSlug: string } }) {
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

  let rows: Row[];
  try {
    rows = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        return tx<Row[]>`
          SELECT m.slug, m.title, m.channel_name,
                 m.channel_type::text AS channel_type,
                 to_char(m.published_date, 'YYYY-MM-DD') AS published_date,
                 m.status::text AS status,
                 d.name AS author_name
            FROM media_appearance m
            LEFT JOIN doctor_profile d
              ON d.instance_id = m.instance_id AND d.id = m.author_doctor_id
           WHERE m.instance_id = ${ctx.instanceId}::uuid
           ORDER BY m.published_date DESC, m.updated_at DESC
        `;
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

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">미디어 (MediaAppearance)</h1>
        <Link href={`/admin/${params.instanceSlug}/media-appearances/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          + 신규 추가
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          아직 미디어가 없습니다.
        </div>
      ) : (
        <table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">제목</th>
              <th className="px-3 py-2">채널</th>
              <th className="px-3 py-2">종류</th>
              <th className="px-3 py-2">게재일</th>
              <th className="px-3 py-2">출연 의료진</th>
              <th className="px-3 py-2">상태</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{r.title}</td>
                <td className="px-3 py-2 text-xs">{r.channel_name}</td>
                <td className="px-3 py-2 text-xs">{r.channel_type}</td>
                <td className="px-3 py-2 text-xs">{r.published_date}</td>
                <td className="px-3 py-2 text-xs">{r.author_name ?? "—"}</td>
                <td className="px-3 py-2"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{r.status}</span></td>
                <td className="px-3 py-2 text-right">
                  <Link href={`/admin/${params.instanceSlug}/media-appearances/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
