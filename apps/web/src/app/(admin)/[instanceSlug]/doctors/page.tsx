// @glitzy/web/(admin)/[instanceSlug]/doctors — 의료진 목록
// cycle2-3entity WEB-23: requirePageContext 공통 helper 사용
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";

type Row = { slug: string; name: string; title: string | null; active: boolean; display_order: number; updated_at: Date };

export default async function DoctorsListPage({ params }: { params: { instanceSlug: string } }) {
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
  let rows: Row[];
  try {
    rows = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        return tx<Row[]>`
          SELECT slug, name, title, active, display_order, updated_at
            FROM doctor_profile
           WHERE instance_id = ${ctx.instanceId}::uuid
           ORDER BY display_order ASC, name ASC
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
        <h1 className="text-2xl font-semibold">의료진 목록</h1>
        <Link
          href={`/${params.instanceSlug}/doctors/new`}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + 신규 추가
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          아직 등록된 의료진이 없습니다.
        </div>
      ) : (
        <table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">순서</th>
              <th className="px-3 py-2">이름</th>
              <th className="px-3 py-2">직함</th>
              <th className="px-3 py-2">slug</th>
              <th className="px-3 py-2">활성</th>
              <th className="px-3 py-2">수정일</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-slate-100">
                <td className="px-3 py-2 font-mono text-xs">{r.display_order}</td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2 text-slate-700">{r.title ?? "—"}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.slug}</td>
                <td className="px-3 py-2">{r.active ? "✓" : "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-500">{new Date(r.updated_at).toISOString().slice(0, 10)}</td>
                <td className="px-3 py-2 text-right">
                  <Link href={`/${params.instanceSlug}/doctors/${r.slug}`} className="text-xs text-blue-700 underline">
                    편집
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
