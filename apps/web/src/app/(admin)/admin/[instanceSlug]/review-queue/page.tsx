// @glitzy/web/(admin)/[instanceSlug]/review-queue — manual-review 큐 list
// SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1 CA-UI-01

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";

type Row = {
  id: string;
  queue_type: string;
  content_type: string;
  content_ref: string;
  compliance_record_id: string;
  status: string;
  priority: string;
  required_roles: string[];
  sla_due_at: Date;
  assigned_to: string | null;
  page_risk_level: string;
};

export default async function ReviewQueueListPage({ params }: { params: { instanceSlug: string } }) {
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
        // M0 v0.1: app_tenant_user 는 admin_user SELECT 권한 없음 — assigned_to UUID 만 표시.
        //   display_name 표시는 별 cycle (base role separated fetch).
        return tx<Row[]>`
          SELECT e.id, e.queue_type::text AS queue_type,
                 e.content_type::text AS content_type, e.content_ref,
                 e.compliance_record_id,
                 e.status::text AS status, e.priority::text AS priority,
                 e.required_roles::text[] AS required_roles,
                 e.sla_due_at,
                 e.assigned_to,
                 cr.page_risk_level::text AS page_risk_level
            FROM review_queue_entry e
            JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
           WHERE e.instance_id = ${ctx.instanceId}::uuid
             AND e.status IN ('open', 'in-progress')
           ORDER BY e.priority ASC, e.sla_due_at ASC
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
        <h1 className="text-2xl font-semibold">검수 큐 (manual-review)</h1>
        <Link href={`/admin/${params.instanceSlug}`} className="text-sm text-slate-600 hover:underline">← 대시보드</Link>
      </header>

      <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-900">
        M0 v0.1 — 수동 검수 큐만 활성 (warning · stale 큐 CA-DEFER-05·06). 자동 룰 검수는 CA-DEFER-01·02 합류 시.
      </div>

      {rows.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          현재 검수 대기 중인 콘텐츠가 없습니다.
        </div>
      ) : (
        <table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
            <tr>
              <th className="px-3 py-2">우선순위</th>
              <th className="px-3 py-2">콘텐츠 유형</th>
              <th className="px-3 py-2">콘텐츠 ref</th>
              <th className="px-3 py-2">위험도</th>
              <th className="px-3 py-2">필요 역할</th>
              <th className="px-3 py-2">상태</th>
              <th className="px-3 py-2">SLA 마감</th>
              <th className="px-3 py-2">담당</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isOverdue = r.sla_due_at && new Date(r.sla_due_at) < new Date();
              return (
                <tr key={r.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 text-xs">
                    <span className={r.priority === "P0" ? "rounded bg-rose-100 px-2 py-0.5 text-rose-700" : "rounded bg-slate-100 px-2 py-0.5"}>{r.priority}</span>
                  </td>
                  <td className="px-3 py-2 text-xs">{r.content_type}</td>
                  <td className="px-3 py-2 font-mono text-xs">{r.content_ref}</td>
                  <td className="px-3 py-2 text-xs">{r.page_risk_level}</td>
                  <td className="px-3 py-2 text-xs">{r.required_roles.join(", ")}</td>
                  <td className="px-3 py-2 text-xs">{r.status}</td>
                  <td className={`px-3 py-2 text-xs ${isOverdue ? "text-rose-700" : "text-slate-500"}`}>
                    {new Date(r.sla_due_at).toISOString().slice(0, 16).replace("T", " ")}
                    {isOverdue ? " ⚠" : ""}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs">{r.assigned_to ? r.assigned_to.slice(0, 8) : "—"}</td>
                  <td className="px-3 py-2 text-right">
                    <Link href={`/admin/${params.instanceSlug}/review-queue/${r.id}`} className="text-xs text-blue-700 underline">검수</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}
