// @glitzy/web/components/forms/WorkflowActionButtons — COMPLIANCE_ASSISTANT_M0_PLAN v1.0 § 5.3 CA-UI-03
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
import type { SubmitContentType } from "@/lib/compliance/types";
import type { SaveResult } from "@/lib/save-result";

export function WorkflowActionButtons({
  instanceSlug,
  contentType,
  contentRef,
  currentStatus,
}: {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
  currentStatus: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-500">현재 상태:</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium">{currentStatus}</span>
      </div>
      {(currentStatus === "draft" || currentStatus === "rejected") && (
        <SubmitForReviewForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
      )}
      {currentStatus === "publishable" && (
        <PublishForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
      )}
      {currentStatus === "review-queued" || currentStatus === "in-review" ? (
        <p className="text-xs text-slate-500">검수 중입니다. 검수자 액션은 <a href={`/admin/${instanceSlug}/review-queue`} className="underline">검수 큐</a> 에서.</p>
      ) : null}
      {currentStatus === "approved" ? (
        <p className="text-xs text-amber-700">approved 상태 — publishable 으로 자동 전이 후 발행 버튼 활성화.</p>
      ) : null}
    </div>
  );
}

function SubmitForReviewForm({
  instanceSlug,
  contentType,
  contentRef,
}: {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
}) {
  const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
  const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
  const err = state && state.ok === false ? state.formError : null;
  return (
    <form action={formAction} className="flex flex-col gap-2">
      {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
      <SubmitButton label="검수 요청" pendingLabel="요청 중…" color="bg-blue-700 hover:bg-blue-800" />
    </form>
  );
}

function PublishForm({
  instanceSlug,
  contentType,
  contentRef,
}: {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
}) {
  const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
  const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
  const err = state && state.ok === false ? state.formError : null;
  return (
    <form action={formAction} className="flex flex-col gap-2">
      {err && <div className="rounded-md border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-900">{err}</div>}
      <SubmitButton label="발행" pendingLabel="발행 중…" color="bg-emerald-700 hover:bg-emerald-800" />
    </form>
  );
}

function SubmitButton({ label, pendingLabel, color }: { label: string; pendingLabel: string; color: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`self-start rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-60 ${color}`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
