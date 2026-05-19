// @glitzy/web/components/forms/ReviewEntryActionForm — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.1
"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { approveEntryAction, rejectEntryAction } from "@/app/(admin)/admin/[instanceSlug]/review-queue/actions";
import type { ApproverRole } from "@/lib/compliance/types";
import type { SaveResult } from "@/lib/save-result";

const ROLE_LABEL: Record<ApproverRole, string> = {
  operator: "operator (peer)",
  medical: "medical (physicianApprover)",
  legal: "legal (legalCounsel)",
};

export function ReviewEntryActionForm({
  instanceSlug,
  entryId,
  role,
}: {
  instanceSlug: string;
  entryId: string;
  role: ApproverRole;
}) {
  const boundApprove = approveEntryAction.bind(null, instanceSlug, entryId, role);
  const boundReject = rejectEntryAction.bind(null, instanceSlug, entryId, role);
  const [approveState, approveAction] = useFormState<SaveResult | null, FormData>(boundApprove, null);
  const [rejectState, rejectAction] = useFormState<SaveResult | null, FormData>(boundReject, null);
  const [reason, setReason] = useState("");
  const approveError = approveState && approveState.ok === false ? approveState.formError : null;
  const rejectError = rejectState && rejectState.ok === false ? rejectState.formError : null;
  const rejectFieldErrors = rejectState && rejectState.ok === false ? rejectState.fieldErrors : {};

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      <h3 className="mb-2 text-sm font-medium">{ROLE_LABEL[role]}</h3>
      {(approveError || rejectError) && (
        <div className="mb-3 rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">
          {approveError ?? rejectError}
        </div>
      )}
      <div className="flex flex-col gap-3">
        <form action={approveAction}>
          <ApproveBtn />
        </form>
        <form action={rejectAction} className="flex flex-col gap-2">
          <label className="flex flex-col gap-1 text-xs">
            <span>거부 사유 (50자 이상)</span>
            <textarea
              name="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              minLength={50}
              maxLength={2000}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900"
            />
            {rejectFieldErrors?.reason && rejectFieldErrors.reason.length > 0 ? (
              <span className="text-xs text-rose-700">{rejectFieldErrors.reason[0]}</span>
            ) : null}
          </label>
          <RejectBtn />
        </form>
      </div>
    </div>
  );
}

function ApproveBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
    >
      {pending ? "승인 중…" : "승인"}
    </button>
  );
}

function RejectBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="self-start rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60"
    >
      {pending ? "거부 중…" : "거부"}
    </button>
  );
}
