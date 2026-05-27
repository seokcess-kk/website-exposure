// @glitzy/web/(admin)/[instanceSlug]/contract — ADMIN_BUSINESS_ENTITIES_PLAN v1.0 § 2
// instance_contract CRUD page. super-admin only.

import { notFound, redirect } from "next/navigation";
import { TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { getSqlBase } from "@/lib/db";
import {
  InstanceContractForm,
  type InstanceContractInitial,
} from "@/components/forms/InstanceContractForm";
import { saveContractAction } from "./actions";

type ContractRow = {
  status: string;
  plan_tier: string;
  billing_cycle: string;
  amount_krw: number;
  start_date: string;
  end_date: string | null;
  contract_holder_name: string;
  contract_holder_email: string;
  notes: string;
  updated_at: Date;
};

const DEFAULT_INITIAL: InstanceContractInitial = {
  status: "trial",
  planTier: "starter",
  billingCycle: "monthly",
  amountKrw: "0",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: "",
  contractHolderName: "",
  contractHolderEmail: "",
  notes: "",
};

export default async function ContractPage({
  params,
}: {
  params: { instanceSlug: string };
}) {
  let pageCtx;
  try {
    pageCtx = await requirePageContext(params.instanceSlug);
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

  if (!pageCtx.ctx.isSuperAdmin) {
    return (
      <main className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-fg-default">계약</h1>
        <section className="rounded-md border border-warning bg-warning-subtle p-4 text-sm text-fg-default">
          <p className="font-medium">권한이 필요합니다.</p>
          <p className="mt-1 text-fg-muted">
            계약 정보는 운영자(super-admin) 만 조회·편집 가능합니다.
          </p>
        </section>
      </main>
    );
  }

  // RLS 미적용 — admin role 직접 query (super-admin only · /admin context 와 동일)
  const sql = getSqlBase();
  const rows = await sql<ContractRow[]>`
    SELECT status, plan_tier, billing_cycle, amount_krw,
           to_char(start_date, 'YYYY-MM-DD') AS start_date,
           to_char(end_date, 'YYYY-MM-DD') AS end_date,
           contract_holder_name, contract_holder_email, notes, updated_at
      FROM instance_contract
     WHERE instance_id = ${pageCtx.instanceId}::uuid
     LIMIT 1
  `;

  const initial: InstanceContractInitial = rows.length === 0
    ? DEFAULT_INITIAL
    : {
        status: rows[0]!.status,
        planTier: rows[0]!.plan_tier,
        billingCycle: rows[0]!.billing_cycle,
        amountKrw: String(rows[0]!.amount_krw),
        startDate: rows[0]!.start_date,
        endDate: rows[0]!.end_date ?? "",
        contractHolderName: rows[0]!.contract_holder_name,
        contractHolderEmail: rows[0]!.contract_holder_email,
        notes: rows[0]!.notes,
      };

  const boundSave = saveContractAction.bind(null, params.instanceSlug);
  const isNew = rows.length === 0;

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-fg-default">계약</h1>
        <p className="text-sm text-fg-muted">
          {isNew
            ? "이 사이트의 계약 정보가 아직 없습니다. 초기 값을 입력하고 저장하세요."
            : `마지막 갱신: ${new Date(rows[0]!.updated_at).toLocaleString("ko-KR")}`}
        </p>
      </header>

      <InstanceContractForm action={boundSave} initial={initial} />

      <footer className="rounded-md border border-dashed border-border bg-bg-default/30 p-4 text-xs text-fg-muted">
        계약 정보는 운영자(super-admin) 만 조회·편집 가능합니다. 메모는 클라이언트에게 노출되지 않습니다.
        본 v1 안 이력 보존은 미지원 — 갱신 시 기존 값 덮어쓰기 (ABE-DEFER-01 안 별 cycle 안 invoice 이력 합류 예정).
      </footer>
    </main>
  );
}
