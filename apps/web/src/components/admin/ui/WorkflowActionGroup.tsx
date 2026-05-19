// @glitzy/web/components/admin/ui/WorkflowActionGroup — ADMIN_UX_REDESIGN v1.0 § 7.4 (UX-UI-04)
// 기존 WorkflowActionButtons (compliance-assistant M0 산출물) superset · backwards-compat:
//   - WorkflowActionGroup = 신 컴포넌트 (StatusBadge 통합 · DESIGN_TOKENS 정합)
//   - WorkflowActionButtons = legacy alias (apps/web/src/components/forms/WorkflowActionButtons.tsx) — 점진 마이그레이션

"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitForReviewAction, publishContentAction } from "@/lib/compliance/entity-actions";
import type { SubmitContentType } from "@/lib/compliance/types";
import type { SaveResult } from "@/lib/save-result";
import { StatusBadge, type ContentStatus } from "./StatusBadge";

export type WorkflowActionGroupProps = {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
  currentStatus: ContentStatus | string;
  /** compact 안 inline 표시 (size sm · button only) */
  compact?: boolean;
};

export function WorkflowActionGroup({
  instanceSlug,
  contentType,
  contentRef,
  currentStatus,
  compact = false,
}: WorkflowActionGroupProps) {
  const status = currentStatus as ContentStatus;
  const showSubmit = status === "draft" || status === "rejected";
  const showPublish = status === "publishable";
  const showReviewNote = status === "review-queued" || status === "in-review";
  const showApproved = status === "approved";

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <StatusBadge status={status} />
        {showSubmit && <SubmitForReviewForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} compact />}
        {showPublish && <PublishForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} compact />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-border bg-elevated p-4">
      <div className="flex items-center gap-3 text-sm">
        <span className="text-fg-muted">현재 상태:</span>
        <StatusBadge status={status} />
      </div>
      {showSubmit && (
        <SubmitForReviewForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
      )}
      {showPublish && (
        <PublishForm instanceSlug={instanceSlug} contentType={contentType} contentRef={contentRef} />
      )}
      {showReviewNote && (
        <p className="text-xs text-fg-muted">
          검수 중입니다. 검수자 액션은{" "}
          <a href={`/admin/${instanceSlug}/review-queue`} className="text-brand-primary underline hover:text-brand-primary-hover">
            검수 큐
          </a>{" "}
          에서.
        </p>
      )}
      {showApproved && (
        <p className="text-xs text-warning">approved 상태 — publishable 으로 자동 전이 후 발행 버튼 활성화.</p>
      )}
    </div>
  );
}

function SubmitForReviewForm({
  instanceSlug,
  contentType,
  contentRef,
  compact,
}: {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
  compact?: boolean;
}) {
  const bound = submitForReviewAction.bind(null, instanceSlug, contentType, contentRef);
  const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
  const err = state && state.ok === false ? state.formError : null;
  return (
    <form action={formAction} className="flex flex-col gap-2">
      {err && !compact && <div className="rounded-md border border-error bg-error-subtle px-3 py-2 text-xs text-fg-default">{err}</div>}
      <ActionButton
        label="검수 요청"
        pendingLabel="요청 중…"
        variant="primary"
        compact={compact}
      />
    </form>
  );
}

function PublishForm({
  instanceSlug,
  contentType,
  contentRef,
  compact,
}: {
  instanceSlug: string;
  contentType: SubmitContentType;
  contentRef: string;
  compact?: boolean;
}) {
  const bound = publishContentAction.bind(null, instanceSlug, contentType, contentRef);
  const [state, formAction] = useFormState<SaveResult | null, FormData>(bound, null);
  const err = state && state.ok === false ? state.formError : null;
  return (
    <form action={formAction} className="flex flex-col gap-2">
      {err && !compact && <div className="rounded-md border border-error bg-error-subtle px-3 py-2 text-xs text-fg-default">{err}</div>}
      <ActionButton
        label="발행"
        pendingLabel="발행 중…"
        variant="success"
        compact={compact}
      />
    </form>
  );
}

function ActionButton({
  label,
  pendingLabel,
  variant,
  compact,
}: {
  label: string;
  pendingLabel: string;
  variant: "primary" | "success" | "secondary";
  compact?: boolean;
}) {
  const { pending } = useFormStatus();
  const colorClass = variant === "primary"
    ? "bg-brand-primary text-fg-inverse hover:bg-brand-primary-hover"
    : variant === "success"
    ? "bg-success text-fg-inverse hover:opacity-90"
    : "border border-border bg-elevated text-fg-default hover:bg-subtle";
  const sizeClass = compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`self-start rounded-md font-medium disabled:opacity-60 ${sizeClass} ${colorClass}`}
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

// backwards-compat alias (legacy import 경로 호환 — 점진 마이그레이션)
export { WorkflowActionGroup as WorkflowActionButtons };
