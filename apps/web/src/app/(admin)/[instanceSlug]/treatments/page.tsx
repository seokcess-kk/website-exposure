// @glitzy/web/(admin)/[instanceSlug]/treatments — 시술 페이지 목록
// cycle2-3entity WEB-23: requirePageContext 통일
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";

type Row = { slug: string; title: string; status: string; risk_level: string | null; updated_at: Date; published_at: Date | null };

export default async function TreatmentsListPage({ params }: { params: { instanceSlug: string } }) {
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
          SELECT slug, title, status::text AS status, risk_level::text AS risk_level, updated_at, published_at
            FROM treatment_page
           WHERE instance_id = ${ctx.instanceId}::uuid
           ORDER BY updated_at DESC
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
        <h1 className="text-2xl font-semibold">시술/진료 페이지</h1>
        <Link href={`/${params.instanceSlug}/treatments/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          + 신규 추가
        </Link>
      </header>

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          아직 등록된 시술/진료 페이지가 없습니다.
        </div>
      ) : (
        <table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">제목</th>
              <th className="px-3 py-2">slug</th>
              <th className="px-3 py-2">상태</th>
              <th className="px-3 py-2">위험도</th>
              <th className="px-3 py-2">발행일</th>
              <th className="px-3 py-2">수정일</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{r.title}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.slug}</td>
                <td className="px-3 py-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{r.status}</span>
                </td>
                <td className="px-3 py-2 text-xs">{r.risk_level ?? "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-500">{r.published_at ? new Date(r.published_at).toISOString().slice(0, 10) : "—"}</td>
                <td className="px-3 py-2 text-xs text-slate-500">{new Date(r.updated_at).toISOString().slice(0, 10)}</td>
                <td className="px-3 py-2 text-right">
                  <Link href={`/${params.instanceSlug}/treatments/${r.slug}`} className="text-xs text-blue-700 underline">
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
