// @glitzy/web/(admin)/[instanceSlug]/review-queue/[entryId] — detail · approve/reject
// SoT: COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1 CA-UI-01

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { assertActionEligibility, TenantResolveError } from "@glitzy/auth";

import { mapAuthDenyReasonToUi } from "@/lib/deny-reason-map";
import { requirePageContext } from "@/lib/page-context";
import { withSkeletonTx } from "@/lib/tenant";
import { ReviewEntryActionForm } from "@/components/forms/ReviewEntryActionForm";
import type { ApproverRole } from "@/lib/compliance/types";

type EntryRow = {
  id: string;
  content_type: string;
  content_ref: string;
  compliance_record_id: string;
  status: string;
  priority: string;
  required_roles: string[];
  sla_due_at: Date;
  page_risk_level: string;
  // record slots — admin_user SELECT 권한 없음 → UUID만 표시 (M0 v0.1)
  peer_reviewer: string | null;
  peer_reviewed_at: Date | null;
  physician_approver: string | null;
  physician_approved_at: Date | null;
  legal_counsel: string | null;
  legal_counsel_at: Date | null;
  auto_check_result: unknown;
};

type ContentPreview = { title: string | null; summary: string | null; body: string | null };

// CAMC-09 정정: content_type 별 read-only preview (table/column allowlist)
const PREVIEW_QUERIES: Record<string, { table: string; titleCol?: string; summaryCol?: string; bodyCol?: string }> = {
  Article: { table: "article", titleCol: "title", summaryCol: "summary", bodyCol: "body_markdown" },
  TreatmentPage: { table: "treatment_page", titleCol: "title", summaryCol: "summary", bodyCol: "body_markdown" },
  LegalDocument: { table: "legal_document", titleCol: "title", bodyCol: "body" },
  FAQ: { table: "faq", titleCol: "question", bodyCol: "answer" },
  Publication: { table: "publication", titleCol: "title", summaryCol: "summary" },
  MediaAppearance: { table: "media_appearance", titleCol: "title", summaryCol: "summary" },
};

export default async function ReviewEntryDetailPage({ params }: { params: { instanceSlug: string; entryId: string } }) {
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

  let entry: EntryRow | null;
  let eligibleRoles: ApproverRole[] = [];
  let preview: ContentPreview | null = null;
  try {
    const result = await withSkeletonTx(
      { signedToken: pageCtx.signedToken, instanceId: pageCtx.instanceId },
      async (tx, ctx) => {
        assertActionEligibility(ctx, "operator-edit-content");
        const rows = await tx<EntryRow[]>`
          SELECT e.id,
                 e.content_type::text AS content_type,
                 e.content_ref,
                 e.compliance_record_id,
                 e.status::text AS status,
                 e.priority::text AS priority,
                 e.required_roles::text[] AS required_roles,
                 e.sla_due_at,
                 cr.page_risk_level::text AS page_risk_level,
                 cr.auto_check_result,
                 cr.peer_reviewer, cr.peer_reviewed_at,
                 cr.physician_approver, cr.physician_approved_at,
                 cr.legal_counsel, cr.legal_counsel_at
            FROM review_queue_entry e
            JOIN compliance_record cr ON cr.id = e.compliance_record_id AND cr.instance_id = e.instance_id
           WHERE e.id = ${params.entryId}::uuid AND e.instance_id = ${ctx.instanceId}::uuid
           LIMIT 1
        `;
        const e = rows[0] ?? null;
        // 본인 가능 role 산정 — instance_membership.role 우선
        const roles: ApproverRole[] = [];
        if (ctx.role === "operator" || ctx.role === "super-admin") roles.push("operator");
        if (ctx.user.physician_reviewer_eligible) roles.push("medical");
        if (ctx.user.legal_reviewer_eligible) roles.push("legal");

        // CAMC-09 정정: content_type 별 preview 조회 (allowlist)
        let preview: ContentPreview | null = null;
        if (e) {
          const q = PREVIEW_QUERIES[e.content_type];
          if (q) {
            const titleSel = q.titleCol ?? "NULL";
            const summarySel = q.summaryCol ?? "NULL";
            const bodySel = q.bodyCol ?? "NULL";
            const previewRows = await tx.unsafe<{ title: string | null; summary: string | null; body: string | null }[]>(`
              SELECT ${titleSel} AS title, ${summarySel} AS summary, ${bodySel} AS body
                FROM ${q.table}
               WHERE instance_id = '${ctx.instanceId}'::uuid AND slug = '${e.content_ref.replace(/'/g, "''")}'
               LIMIT 1
            `);
            preview = previewRows[0] ?? null;
          }
        }

        return { entry: e, eligibleRoles: roles, preview };
      },
    );
    entry = result.entry;
    eligibleRoles = result.eligibleRoles;
    preview = result.preview;
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
  if (entry === null) notFound();

  // 본인 가능 + entry.required_roles 안 + 아직 채워지지 않은 role 만 노출
  const filledRoles = new Set<ApproverRole>();
  if (entry.peer_reviewed_at !== null) filledRoles.add("operator");
  if (entry.physician_approved_at !== null) filledRoles.add("medical");
  if (entry.legal_counsel_at !== null) filledRoles.add("legal");
  const required = new Set(entry.required_roles as ApproverRole[]);
  const actionableRoles = eligibleRoles.filter((r) => required.has(r) && !filledRoles.has(r));

  return (
    <main className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">검수 — {formatContentType(entry.content_type)} · {entry.content_ref}</h1>
        <Link href={`/admin/${params.instanceSlug}/review-queue`} className="text-sm text-slate-600 hover:underline">← 큐 목록</Link>
      </header>

      <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
        <h2 className="mb-2 text-base font-medium">콘텐츠 메타</h2>
        <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
          <dt className="text-slate-500">유형</dt><dd>{formatContentType(entry.content_type)}</dd>
          <dt className="text-slate-500">slug</dt><dd className="font-mono text-xs">{entry.content_ref}</dd>
          <dt className="text-slate-500">위험도</dt><dd>{entry.page_risk_level}</dd>
          <dt className="text-slate-500">필요 역할</dt><dd>{entry.required_roles.join(", ")}</dd>
          <dt className="text-slate-500">우선순위</dt><dd>{entry.priority}</dd>
          <dt className="text-slate-500">SLA 마감</dt><dd className="text-xs">{new Date(entry.sla_due_at).toISOString().slice(0, 16).replace("T", " ")}</dd>
          <dt className="text-slate-500">상태</dt><dd>{entry.status}</dd>
        </dl>
      </section>

      {preview ? (
        <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
          <h2 className="mb-2 text-base font-medium">콘텐츠 미리보기</h2>
          {preview.title && (
            <h3 className="mb-2 text-base font-semibold text-fg-default">{preview.title}</h3>
          )}
          {preview.summary && (
            <p className="mb-3 text-sm text-fg-muted">{preview.summary}</p>
          )}
          {preview.body && (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded border border-slate-100 bg-slate-50 p-3 text-xs text-fg-default">{preview.body}</pre>
          )}
        </section>
      ) : null}

      <section className="rounded-md border border-slate-200 bg-white p-4 text-sm">
        <h2 className="mb-2 text-base font-medium">검수 슬롯</h2>
        <dl className="grid grid-cols-[12rem_1fr] gap-y-1">
          <dt className="text-slate-500">운영 검수</dt>
          <dd className="font-mono text-xs">{entry.peer_reviewer ? `${entry.peer_reviewer.slice(0, 8)}… · ${entry.peer_reviewed_at ? new Date(entry.peer_reviewed_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
          <dt className="text-slate-500">의료 검수</dt>
          <dd className="font-mono text-xs">{entry.physician_approver ? `${entry.physician_approver.slice(0, 8)}… · ${entry.physician_approved_at ? new Date(entry.physician_approved_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
          <dt className="text-slate-500">법무 검수</dt>
          <dd className="font-mono text-xs">{entry.legal_counsel ? `${entry.legal_counsel.slice(0, 8)}… · ${entry.legal_counsel_at ? new Date(entry.legal_counsel_at).toISOString().slice(0, 10) : "—"}` : "—"}</dd>
        </dl>
      </section>

      {actionableRoles.length === 0 ? (
        <div className="rounded-md border border-slate-200 bg-white p-4 text-sm text-slate-500">
          본인이 수행 가능한 검수 역할이 없습니다.
        </div>
      ) : (
        <section className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="mb-2 text-base font-medium">검수 액션</h2>
          <p className="mb-3 text-xs text-slate-500">본인 가능 역할: {actionableRoles.map(formatRole).join(", ")}</p>
          {actionableRoles.map((role) => (
            <ReviewEntryActionForm
              key={role}
              instanceSlug={params.instanceSlug}
              entryId={params.entryId}
              role={role}
            />
          ))}
        </section>
      )}
    </main>
  );
}

function formatContentType(type: string): string {
  const labels: Record<string, string> = {
    Article: "아티클",
    TreatmentPage: "시술/진료",
    LegalDocument: "정책 문서",
    FAQ: "FAQ",
    Publication: "논문",
    MediaAppearance: "미디어",
    DoctorProfile: "의료진",
  };
  return labels[type] ?? type;
}

function formatRole(role: ApproverRole): string {
  const labels: Record<ApproverRole, string> = {
    operator: "운영 검수",
    medical: "의료 검수",
    legal: "법무 검수",
  };
  return labels[role];
}
