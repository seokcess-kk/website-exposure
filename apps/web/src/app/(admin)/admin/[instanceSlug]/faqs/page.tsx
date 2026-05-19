import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { FaqSpreadsheet } from "@/components/admin/FaqSpreadsheet";

type Row = {
  slug: string;
  question: string;
  display_order: number;
  category_name: string | null;
  author_name: string | null;
  status: string;
};

export default async function FaqsListPage({ params }: { params: { instanceSlug: string } }) {
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
          SELECT f.slug, f.question, f.display_order,
                 c.name AS category_name,
                 d.name AS author_name,
                 f.status::text AS status
            FROM faq f
            LEFT JOIN article_category c
              ON c.instance_id = f.instance_id AND c.id = f.category_id
            LEFT JOIN doctor_profile d
              ON d.instance_id = f.instance_id AND d.id = f.author_doctor_id
           WHERE f.instance_id = ${ctx.instanceId}::uuid
           ORDER BY f.display_order ASC, f.updated_at DESC
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
        <h1 className="text-2xl font-semibold">자주 묻는 질문 (FAQ)</h1>
        <Link href={`/admin/${params.instanceSlug}/faqs/new`} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          + 신규 추가
        </Link>
      </header>

      <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-900">
        v0.1 단계: FAQ 발행은 compliance-assistant + 위험도 자동 추론 합류 후 활성화됩니다 (EC-DEFER-05·12).
      </div>

      {/* ADMIN_UX_REDESIGN v1.0 § 7 — 다건 spreadsheet 입력 */}
      <FaqSpreadsheet instanceSlug={params.instanceSlug} initialRows={5} />

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          아직 FAQ 가 없습니다.
        </div>
      ) : (
        <table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">순서</th>
              <th className="px-3 py-2">질문</th>
              <th className="px-3 py-2">카테고리</th>
              <th className="px-3 py-2">작성자</th>
              <th className="px-3 py-2">상태</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug} className="border-t border-slate-100">
                <td className="px-3 py-2 text-xs">{r.display_order}</td>
                <td className="px-3 py-2 font-medium">{r.question}</td>
                <td className="px-3 py-2 text-xs">{r.category_name ?? "—"}</td>
                <td className="px-3 py-2 text-xs">{r.author_name ?? "—"}</td>
                <td className="px-3 py-2"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{r.status}</span></td>
                <td className="px-3 py-2 text-right">
                  <Link href={`/admin/${params.instanceSlug}/faqs/${r.slug}`} className="text-xs text-blue-700 underline">편집</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
