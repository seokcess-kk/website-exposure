// @glitzy/web/(admin)/[instanceSlug]/categories — ArticleCategory 목록
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";

type Row = {
  slug: string;
  name: string;
  description: string | null;
  display_order: number;
  article_count: number;
  updated_at: Date;
};

export default async function CategoriesListPage({ params }: { params: { instanceSlug: string } }) {
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
          SELECT c.slug, c.name, c.description, c.display_order, c.updated_at,
                 (SELECT COUNT(*)::int FROM article a
                   WHERE a.instance_id = c.instance_id AND a.category_id = c.id) AS article_count
            FROM article_category c
           WHERE c.instance_id = ${ctx.instanceId}::uuid
           ORDER BY c.display_order ASC, c.name ASC
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
        <h1 className="text-2xl font-semibold">아티클 카테고리</h1>
        <Link href={`/admin/${params.instanceSlug}/categories/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          + 신규 추가
        </Link>
      </header>

      <p className="text-xs text-slate-500">
        기본 카테고리는 자동 생성되며 삭제할 수 없습니다.
      </p>

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          아직 카테고리가 없습니다.
        </div>
      ) : (
        <table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">이름</th>
              <th className="px-3 py-2">slug</th>
              <th className="px-3 py-2">설명</th>
              <th className="px-3 py-2">순서</th>
              <th className="px-3 py-2">아티클 수</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{r.name}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500">{r.slug}</td>
                <td className="px-3 py-2 text-xs text-slate-500">{r.description ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{r.display_order}</td>
                <td className="px-3 py-2 text-xs">{r.article_count}</td>
                <td className="px-3 py-2 text-right">
                  <Link href={`/admin/${params.instanceSlug}/categories/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
